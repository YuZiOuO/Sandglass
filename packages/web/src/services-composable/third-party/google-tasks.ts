import { useMutation, useQuery } from '@tanstack/vue-query'
import { patchGoogle, postGoogle, queryGoogle } from './google'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { globalQueryClient } from '../common'
import { googleCalendarKeys } from './google-calendar'
import { isGoogleTokenAvailable } from './google'

const baseURL = 'https://tasks.googleapis.com'

const googleTasksKeys = {
  namespace: ['google', 'tasks'] as const,
  tasklists: () => [...googleTasksKeys.namespace, 'tasklists'] as const,
  tasklist: (tasklistId: string) => [...googleTasksKeys.tasklists(), tasklistId] as const,
  tasks: (tasklistId: string) => [...googleCalendarKeys.namespace, 'tasks', tasklistId] as const,
}

export function useGoogleTaskListsQuery() {
  return useQuery({
    queryKey: googleTasksKeys.tasklists(),
    queryFn: async () => queryGoogle<gapi.client.tasks.TaskLists>(baseURL + '/tasks/v1/users/@me/lists'),
    enabled: () => isGoogleTokenAvailable.value,
  })
}

export function useGoogleTaskListQuery(tasklistId: MaybeRefOrGetter<string | undefined>) {
  const id = computed(() => toValue(tasklistId))
  return useQuery({
    queryKey: computed(() => googleTasksKeys.tasklist(id.value!)),
    queryFn: async () =>
      queryGoogle<gapi.client.tasks.TaskList>(
        baseURL + `/tasks/v1/users/@me/lists/${encodeURIComponent(id.value!)}`,
      ),
    enabled: () => isGoogleTokenAvailable.value && !!id.value,
  })
}

export function useGoogleTasksQuery(tasklistId: MaybeRefOrGetter<string | undefined>) {
  const id = computed(() => toValue(tasklistId))

  return useQuery({
    queryKey: googleTasksKeys.tasks(id.value!),
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
    onSuccess: (_data, variables) =>
      globalQueryClient.invalidateQueries({
        queryKey: googleTasksKeys.tasks(variables.tasklistId),
      }),
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
    onSuccess: async (_data, variables) =>
      globalQueryClient.invalidateQueries({
        queryKey: googleTasksKeys.tasks(variables.tasklistId),
      }),
  })
}
