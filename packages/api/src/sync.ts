import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { encodeHexLowerCase } from '@oslojs/encoding'

type SyncSnapshot = {
  hash: string
  updatedAt: string
  data: Record<string, unknown>
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
    const object = await bucket.get(`sync/${key}/state.json`)
    const snapshot = await object?.json<SyncSnapshot>()
    setCookie(c, 'sync_secret', secret, { httpOnly: true, sameSite: 'Lax', path: '/sync' })
    return c.json({ snapshot: snapshot ?? null })
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
    const object = await bucket.get(`sync/${key}/state.json`)
    const current = await object?.json<SyncSnapshot>()
    const input = await c.req.json<SyncRequest>()

    // Reject stale snapshot.
    if (current?.hash !== input.baseHash) {
      return c.json({ conflict: true, snapshot: current ?? null }, 409)
    }

    // Hash snapshot data.
    const dataDigest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(JSON.stringify(input.data)),
    )
    const hash = encodeHexLowerCase(new Uint8Array(dataDigest))
    const snapshot: SyncSnapshot = {
      hash,
      updatedAt: new Date().toISOString(),
      data: input.data,
    }

    // Persist current snapshot.
    await bucket.put(`sync/${key}/state.json`, JSON.stringify(snapshot), {
      httpMetadata: { contentType: 'application/json' },
    })

    setCookie(c, 'sync_secret', secret, { httpOnly: true, sameSite: 'Lax', path: '/sync' })
    return c.json({ snapshot })
  })

export default app
