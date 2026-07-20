import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'

export const cli = hc<AppType>(import.meta.env.VITE_API_ROOT ?? '')
