import { useMutation, useQuery } from '@tanstack/vue-query'
import { deleteGoogle, patchGoogle, postGoogle, queryGoogle } from './google'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { globalQueryClient } from '../common'
import { isGoogleTokenAvailable } from './google'

const baseURL = 'https://tasks.googleapis.com'

const googleTasksKeys = {
  namespace: ['google', 'tasks'] as const,
  tasklists: () => [...googleTasksKeys.namespace, 'tasklists'] as const,
  tasklist: (tasklistId: string) => [...googleTasksKeys.tasklists(), tasklistId] as const,
  tasks: (tasklistId: string, showAll?: boolean) =>
    [...googleTasksKeys.namespace, 'tasks', tasklistId, { showAll: showAll }] as const,
}

export function useGoogleTaskListsQuery() {
  return useQuery({
    queryKey: googleTasksKeys.tasklists(),
    queryFn: async () =>
      queryGoogle<gapi.client.tasks.TaskLists>(baseURL + '/tasks/v1/users/@me/lists'),
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

// showAll defaults to false
export function useGoogleTasksQuery(
  tasklistId: MaybeRefOrGetter<string | undefined>,
  showAll?: MaybeRefOrGetter<boolean | undefined>,
) {
  const id = computed(() => toValue(tasklistId))
  const showAllItems = computed(() => toValue(showAll))
  return useQuery({
    queryKey: computed(() => googleTasksKeys.tasks(id.value!, showAllItems.value)),
    queryFn: async () => {
      const endpoint = baseURL + `/tasks/v1/lists/${encodeURIComponent(id.value!)}/tasks?`
      const params = new URLSearchParams({
        maxResult: '100',
        showHidden: String(showAllItems.value ?? false),
        showCompleted: 'true',
      })
      return queryGoogle<gapi.client.tasks.Tasks>(endpoint + params.toString())
    },
    enabled: () => !!toValue(tasklistId),
  })
}

export type googleTask = gapi.client.tasks.Task
export function useGoogleTasksCreateMutation() {
  return useMutation({
    mutationFn: async (dto: { data: googleTask; tasklistId: string }) =>
      postGoogle<googleTask>(
        baseURL + `/tasks/v1/lists/${encodeURIComponent(dto.tasklistId)}/tasks`,
        dto.data,
      ),
    onSuccess: async (_data, variables) =>
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
          `/tasks/v1/lists/${encodeURIComponent(dto.tasklistId)}/tasks/${encodeURIComponent(dto.data.id)}`,
        dto.data,
      )
    },
    onSuccess: async (_data, variables) =>
      globalQueryClient.invalidateQueries({
        queryKey: googleTasksKeys.tasks(variables.tasklistId),
      }),
  })
}

export function useGoogleTaskListsCreateMutation() {
  return useMutation({
    mutationFn: async (dto: { data: gapi.client.tasks.TaskList }) =>
      postGoogle<gapi.client.tasks.TaskList>(
        baseURL + '/tasks/v1/users/@me/lists',
        dto.data,
      ),
    onSuccess: async () =>
      globalQueryClient.invalidateQueries({
        queryKey: googleTasksKeys.tasklists(),
      }),
  })
}

export function useGoogleTaskListsDeleteMutation() {
  return useMutation({
    mutationFn: async (tasklistId: string) =>
      deleteGoogle<void>(
        baseURL + `/tasks/v1/users/@me/lists/${encodeURIComponent(tasklistId)}`,
      ),
    onSuccess: async () =>
      globalQueryClient.invalidateQueries({
        queryKey: googleTasksKeys.tasklists(),
      }),
  })
}
