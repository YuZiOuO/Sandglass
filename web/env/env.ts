/// <reference types="vite/client" />
export const SG_API_PREFIX = 'SG_WEB_'
export const SG_ENV_DIR = 'env'
const SG_ENVS_NEEDED = [
  'API_BASEURL',
  'FB_APIKEY',
  'FB_AUTH_DOMAIN',
  'FB_PROJECT_ID',
  'FB_STORAGE_BUCKET',
  'FB_MESSAGING_SENDER_ID',
  'FB_APP_ID',
]

export function checkEnvsDefinedAndNotEmpty() {
  for (const env of SG_ENVS_NEEDED) {
    const fullEnvName = SG_API_PREFIX + env
    if (!(fullEnvName in import.meta.env) || import.meta.env[fullEnvName] === '') {
      throw new Error('Missing environment variable: ' + fullEnvName)
    }
  }
}
