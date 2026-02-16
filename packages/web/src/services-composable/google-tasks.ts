import { useQuery } from '@tanstack/vue-query'
import { authCli } from './common'

const baseURL = 'https://tasks.googleapis.com'

const defaultEnabled = () => !!authCli.useSession().value.data?.user.id
async function fetchGoogleApi<T>(endpoint: string) {
  const token = await authCli.getAccessToken({ providerId: 'google' })

  if (token.error || !token.data.accessToken) {
    return null
  }

  const res = await fetch(endpoint, { headers: { Authorization: 'Bearer ' + token }})
  const data = (await res.json()) as T

  return data
}

export function useGoogleTaskListsQuery() {
  return useQuery({
    queryKey: ['google', 'tasklists'],
    queryFn: async () => {
      return fetchGoogleApi<gapi.client.tasks.TaskLists>(baseURL + '/tasks/v1/users/@me/lists')
    },
    enabled: defaultEnabled,
  })
}

export function useGoogleTaskListQuery(id: string) {
  return useQuery({
    queryKey: ['google', 'tasklists', id],
    queryFn: async () => {
      return fetchGoogleApi<gapi.client.tasks.TaskList>(baseURL + `/tasks/v1/users/@me/lists/${id}`)
    },
    enabled: defaultEnabled,
  })
}

export function useGoogleTasksQuery(tasklistId: string) {
  return useQuery({
    queryKey: ['google', 'tasks', tasklistId],
    queryFn: async () => {
      return fetchGoogleApi<gapi.client.tasks.Tasks>(
        baseURL + `/tasks/v1/lists/${tasklistId}/tasks`,
      )
    },
  })
}