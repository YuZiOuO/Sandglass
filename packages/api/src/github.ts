import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { Hono } from 'hono'
import { GitHub, generateState } from 'arctic'

const GITHUB_PROFILE_URL = 'https://api.github.com/user'

const app = new Hono<{
  Bindings: {
    GITHUB_CLIENT_ID: string
    GITHUB_CLIENT_SECRET: string
    WEB_ORIGIN?: string
  }
}>()
  // Starts the GitHub authorization flow.
  .get('/authorize', (c) => {
    const state = generateState()
    const github = new GitHub(
      c.env.GITHUB_CLIENT_ID,
      c.env.GITHUB_CLIENT_SECRET,
      new URL('/github/callback', c.req.url).toString(),
    )
    const authUrl = github.createAuthorizationURL(state, [])

    setCookie(c, 'github_oauth_state', state, {
      httpOnly: true,
      secure: c.req.url.startsWith('https:'),
      sameSite: 'Lax',
      path: '/github',
      maxAge: 600,
    })
    return c.redirect(authUrl.toString())
  })

  // Handles GitHub's authorization callback and stores the refresh token.
  .get('/callback', async (c) => {
    const code = c.req.query('code')
    const state = c.req.query('state')
    const savedState = getCookie(c, 'github_oauth_state')
    if (!code || state !== savedState) {
      return c.text('Invalid GitHub OAuth callback.', 400)
    }

    const github = new GitHub(
      c.env.GITHUB_CLIENT_ID,
      c.env.GITHUB_CLIENT_SECRET,
      new URL('/github/callback', c.req.url).toString(),
    )
    let token
    try {
      token = await github.validateAuthorizationCode(code)
    } catch {
      return c.text('GitHub token exchange failed.', 400)
    }

    if (!token.hasRefreshToken()) {
      return c.text('GitHub did not return a refresh token.', 400)
    }

    deleteCookie(c, 'github_oauth_state', { path: '/github' })
    setCookie(c, 'github_refresh_token', token.refreshToken(), {
      httpOnly: true,
      secure: c.req.url.startsWith('https:'),
      sameSite: 'Lax',
      path: '/github',
    })
    return c.redirect(c.env.WEB_ORIGIN ?? new URL('/', c.req.url).origin)
  })

  // Restores the GitHub authorization and returns a short-lived access token.
  .post('/access-token', async (c) => {
    const refreshToken = getCookie(c, 'github_refresh_token')
    if (!refreshToken) {
      return c.json({ authenticated: false }, 401)
    }

    const github = new GitHub(
      c.env.GITHUB_CLIENT_ID,
      c.env.GITHUB_CLIENT_SECRET,
      new URL('/github/callback', c.req.url).toString(),
    )
    let token
    try {
      token = await github.refreshAccessToken(refreshToken)
    } catch {
      deleteCookie(c, 'github_refresh_token', { path: '/github' })
      return c.json({ authenticated: false }, 401)
    }

    if (token.hasRefreshToken()) {
      setCookie(c, 'github_refresh_token', token.refreshToken(), {
        httpOnly: true,
        secure: c.req.url.startsWith('https:'),
        sameSite: 'Lax',
        path: '/github',
      })
    }

    const profileResponse = await fetch(GITHUB_PROFILE_URL, {
      headers: { Authorization: `Bearer ${token.accessToken()}` },
    })
    if (!profileResponse.ok) {
      deleteCookie(c, 'github_refresh_token', { path: '/github' })
      return c.json({ authenticated: false }, 401)
    }

    return c.json({ authenticated: true, accessToken: token.accessToken() })
  })

export default app
