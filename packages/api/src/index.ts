import { Hono } from 'hono'
import google from './google'
import github from './github'
import sync from './sync'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    WEB_ORIGIN?: string
  }
}>()
  .use(
    '*',
    cors({
      origin: (origin, c) => c.env.WEB_ORIGIN ?? origin,
      credentials: true,
    }),
  )
  .get('/', (c) => {
    return c.text('Service Healthy!')
  })
  .route('/google', google)
  .route('/github', github)
  .route('/sync', sync)

export type AppType = typeof app
export default app
