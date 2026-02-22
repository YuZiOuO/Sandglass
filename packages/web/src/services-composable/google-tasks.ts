import { useQuery } from '@tanstack/vue-query'
import { defaultEnabled, fetchGoogleApi } from './common-google'

const baseURL = 'https://tasks.googleapis.com'

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