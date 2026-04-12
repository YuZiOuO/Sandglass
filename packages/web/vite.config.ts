import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'

import { defineConfig, loadEnv } from 'vite'
import { z } from 'zod'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'SG_')
  // Fail the build early instead of shipping a bundle that crashes at runtime.
  z.object({
    SG_WEB_API_BASEURL: z.url(),
  }).parse(env)

  return {
    envPrefix: 'SG_',
    plugins: [vue(), vueJsx(), vueDevTools(), svgLoader(), UnoCSS()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
