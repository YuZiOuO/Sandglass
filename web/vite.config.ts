import { fileURLToPath, URL } from 'node:url'

import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

const prefix = 'SG_WEB_'
const envsNeeded = [
  'API_BASEURL',
  'FB_APIKEY',
  'FB_AUTH_DOMAIN',
  'FB_PROJECT_ID',
  'FB_STORAGE_BUCKET',
  'FB_MESSAGING_SENDER_ID',
  'FB_APP_ID',
]
const envDir = 'env'

// https://vite.dev/config/

export default defineConfig((viteMetaConfig: ConfigEnv): UserConfig => {
  console.log('Loading environments for mode: ' + viteMetaConfig.mode)
  const loadedEnvs = loadEnv(viteMetaConfig.mode, envDir, prefix)
  // Load all env variables including those with no prefix
  for (const env of envsNeeded) {
    const fullEnvName = prefix + env
    if (!(fullEnvName in loadedEnvs) || loadedEnvs[fullEnvName] === '') {
      throw new Error('Missing environment variable ' + fullEnvName)
    }
  }

  return {
    envDir: envDir,
    plugins: [vue(), vueJsx(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
