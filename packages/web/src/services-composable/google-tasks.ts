import { useMutation, useQuery } from '@tanstack/vue-query'
import { defaultEnabled, mutateGoogle, queryGoogle } from './common-google'
import { toValue, type MaybeRefOrGetter } from 'vue'

const baseURL = 'https://tasks.googleapis.com'

export function useGoogleTaskListsQuery() {
  return useQuery({
    queryKey: ['google', 'tasklists'],
    queryFn: async () => {
      return queryGoogle<gapi.client.tasks.TaskLists>(baseURL + '/tasks/v1/users/@me/lists')
    },
    enabled: defaultEnabled,
  })
}

export function useGoogleTaskListQuery(id: string) {
  return useQuery({
    queryKey: ['google', 'tasklists', id],
    queryFn: async () => {
      return queryGoogle<gapi.client.tasks.TaskList>(baseURL + `/tasks/v1/users/@me/lists/${id}`)
    },
    enabled: defaultEnabled,
  })
}

export function useGoogleTasksQuery(tasklistId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['google', 'tasks', tasklistId],
    queryFn: async () => {
      return queryGoogle<gapi.client.tasks.Tasks>(
        baseURL + `/tasks/v1/lists/${encodeURIComponent(toValue(tasklistId))}/tasks`,
      )
    },
  })
}

export type googleTasksCreateDTO = gapi.client.tasks.Task
export function useGoogleTasksCreateMutation() {
  return useMutation({
    mutationFn: async (dto: { data: googleTasksCreateDTO; tasklistId: string }) => {
      return mutateGoogle<gapi.client.tasks.Task>(
        baseURL + `/tasks/v1/lists/${encodeURIComponent(toValue(dto.tasklistId))}/tasks`,
        dto.data,
      )
    },
  })
}
