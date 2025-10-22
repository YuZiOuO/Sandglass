import { defineStore } from 'pinia'
import { useOAuthStore } from './oauth'
import { useGApi } from '@/hooks/gapi'

export const useGoogleTasksStore = defineStore('google-tasks', () => {
  const oauthStore = useOAuthStore()

  async function listTaskLists() {
    await useGApi(['tasks'])
    const req = gapi.client.tasks.tasklists.list({
      oauth_token: await oauthStore.getGoogleAccessToken(),
    })

    return (await req).result
  }

  async function listTasks(tasklistId: string) {
    await useGApi(['tasks'])
    const req = gapi.client.tasks.tasks.list({
      tasklist: tasklistId,
      showHidden: true,
      oauth_token: await oauthStore.getGoogleAccessToken(),
    })

    return (await req).result
  }

  async function insertTask(tasklistId: string, task: gapi.client.tasks.Task) {
    await useGApi(['tasks'])
    const req = gapi.client.tasks.tasks.insert({
      tasklist: tasklistId,
      oauth_token: await oauthStore.getGoogleAccessToken(),
      resource: task,
    })
  }

  return { listTaskLists, listTasks, insertTask }
})
