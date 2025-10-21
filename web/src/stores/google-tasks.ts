import { defineStore } from 'pinia'
import { useOAuthStore } from './oauth'
import { useGApi } from '@/hooks/gapi'

export const useGoogleTasksStore = defineStore('google-tasks', () => {
  const oauthStore = useOAuthStore()
  useGApi(['tasks'])

  async function listTaskLists() {
    const req = gapi.client.tasks.tasklists.list({
      oauth_token: await oauthStore.getGoogleAccessToken(),
    })

    return (await req).result
  }

  return { listTaskLists }
})
