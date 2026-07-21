import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { encodeHexLowerCase } from '@oslojs/encoding'

type SyncSnapshot = {
  hash: string
  updatedAt: string
  data: Record<string, unknown>
  credentials?: {
    googleRefreshToken?: string
    githubRefreshToken?: string
  }
}

type SyncRequest = {
  baseHash?: string
  data: Record<string, unknown>
}

const app = new Hono<{
  Bindings: {
    SYNC_BUCKET: {
      get: (key: string) => Promise<{ json: <T>() => Promise<T> } | null>
      put: (key: string, value: string, options?: object) => Promise<void>
    }
  }
}>()
  // Read browser snapshot.
  .get('/', async (c) => {
    const bucket = c.env.SYNC_BUCKET
    const secret =
      getCookie(c, 'sync_secret') ?? encodeHexLowerCase(crypto.getRandomValues(new Uint8Array(32)))

    // Derive private object key.
    const keyDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
    const key = encodeHexLowerCase(new Uint8Array(keyDigest))

    // Read current snapshot.
    const object = await bucket.get(key)
    const snapshot = await object?.json<SyncSnapshot>()
    if (snapshot?.credentials?.googleRefreshToken) {
      setCookie(c, 'google_refresh_token', snapshot.credentials.googleRefreshToken, {
        httpOnly: true,
        secure: c.req.url.startsWith('https:'),
        sameSite: 'Lax',
        path: '/',
      })
    }
    if (snapshot?.credentials?.githubRefreshToken) {
      setCookie(c, 'github_refresh_token', snapshot.credentials.githubRefreshToken, {
        httpOnly: true,
        secure: c.req.url.startsWith('https:'),
        sameSite: 'Lax',
        path: '/',
      })
    }
    setCookie(c, 'sync_secret', secret, { httpOnly: true, sameSite: 'Lax', path: '/sync' })
    return c.json({
      snapshot: snapshot
        ? { hash: snapshot.hash, updatedAt: snapshot.updatedAt, data: snapshot.data }
        : null,
    })
  })
  // Write browser snapshot.
  .put('/', async (c) => {
    const bucket = c.env.SYNC_BUCKET
    const secret =
      getCookie(c, 'sync_secret') ?? encodeHexLowerCase(crypto.getRandomValues(new Uint8Array(32)))

    // Derive private object key.
    const keyDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
    const key = encodeHexLowerCase(new Uint8Array(keyDigest))

    // Read current snapshot.
    const object = await bucket.get(key)
    const current = await object?.json<SyncSnapshot>()
    const input = await c.req.json<SyncRequest>()
    const googleRefreshToken = getCookie(c, 'google_refresh_token')
    const githubRefreshToken = getCookie(c, 'github_refresh_token')

    // Reject stale snapshot.
    if (current?.hash !== input.baseHash) {
      return c.json(
        {
          conflict: true,
          snapshot: current
            ? { hash: current.hash, updatedAt: current.updatedAt, data: current.data }
            : null,
        },
        409,
      )
    }

    // Hash snapshot data.
    const dataDigest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(input.data)),
    )
    const hash = encodeHexLowerCase(new Uint8Array(dataDigest))
    const credentials = {
      googleRefreshToken: googleRefreshToken ?? current?.credentials?.googleRefreshToken,
      githubRefreshToken: githubRefreshToken ?? current?.credentials?.githubRefreshToken,
    }
    const snapshot: SyncSnapshot = {
      hash,
      updatedAt: new Date().toISOString(),
      data: input.data,
      ...(credentials.googleRefreshToken || credentials.githubRefreshToken ? { credentials } : {}),
    }

    // Persist current snapshot.
    await bucket.put(key, JSON.stringify(snapshot), {
      httpMetadata: { contentType: 'application/json' },
    })

    setCookie(c, 'sync_secret', secret, { httpOnly: true, sameSite: 'Lax', path: '/sync' })
    return c.json({
      snapshot: { hash: snapshot.hash, updatedAt: snapshot.updatedAt, data: snapshot.data },
    })
  })

export default app
