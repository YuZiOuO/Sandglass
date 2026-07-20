import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { hc } from 'hono/client'
import type { AppType } from '@sandglass/api'

// Initialize API Client
export const cli = hc<AppType>(import.meta.env.VITE_API_ROOT ?? '')

// Initialize Vue App
const app = createApp(App)
app.use(router)
app.mount('#app')
