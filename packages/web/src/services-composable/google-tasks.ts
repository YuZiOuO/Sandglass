import { useMutation, useQuery } from '@tanstack/vue-query'
import { defaultEnabled, patchGoogle, postGoogle, queryGoogle } from './common-google'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { globalQueryClient } from './common'

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

export function useGoogleTasksQuery(tasklistId: MaybeRefOrGetter<string | undefined>) {
  return useQuery({
    queryKey: ['google', 'tasks', tasklistId],
    queryFn: async () => {
      return queryGoogle<gapi.client.tasks.Tasks>(
        baseURL + `/tasks/v1/lists/${encodeURIComponent(toValue(tasklistId)!)}/tasks`,
      )
    },
    enabled: () => !!toValue(tasklistId),
  })
}

export type googleTask = gapi.client.tasks.Task
export function useGoogleTasksCreateMutation() {
  return useMutation({
    mutationFn: async (dto: { data: googleTask; tasklistId: string }) => {
      return await postGoogle<googleTask>(
        baseURL + `/tasks/v1/lists/${encodeURIComponent(toValue(dto.tasklistId))}/tasks`,
        dto.data,
      )
    },
  })
}

export function useGoogleTasksPatchMutation() {
  return useMutation({
    mutationFn: async (dto: { data: Partial<googleTask>; tasklistId: string }) => {
      if (!dto.data.id) {
        throw new Error('Cannot PATCH an entity with no id.')
      }
      return await patchGoogle<googleTask>(
        baseURL +
          `/tasks/v1/lists/${encodeURIComponent(toValue(dto.tasklistId))}/tasks/${encodeURIComponent(toValue(dto.data.id))}`,
        dto.data,
      )
    },
    onSuccess: async (_data, variable) => {
      globalQueryClient.invalidateQueries({ queryKey: ['google', 'tasks', variable.tasklistId] })
    },
  })
}
