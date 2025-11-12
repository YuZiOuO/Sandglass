import { useGApi } from '@/hooks/gapi'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { globalQueryClient } from '.'

export function useTaskListsQuery() {
  return useQuery({
    queryKey: ['tasklists'],
    queryFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasklists.list({
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}

export function useTasksQuery(taskListId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['tasklists', taskListId, 'tasks'],
    queryFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.list({
        tasklist: toValue(taskListId),
        showHidden: true,
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
    enabled: computed(() => toValue(taskListId).length > 0),
  })
}

export function useTaskAddMutation() {
  return useMutation({
    mutationFn: async (variable: {
      meta: { tasklistId: string }
      task: gapi.client.tasks.Task
    }) => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.insert(
        {
          tasklist: variable.meta.tasklistId,
          oauth_token: await useGoogleAccessToken(),
        },
        variable.task,
      )

      return (await req).result
    },
    onSuccess: invalidateTasksCache,
  })
}

export function useTaskPatchMutation() {
  return useMutation({
    mutationFn: async (variable: {
      meta: { tasklistId: string; taskId: string }
      task: gapi.client.tasks.Task
    }) => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.patch(
        {
          tasklist: variable.meta.tasklistId,
          task: variable.meta.taskId,
          oauth_token: await useGoogleAccessToken(),
        },
        variable.task,
      )

      return (await req).result
    },
    onSuccess: invalidateTasksCache,
  })
}

export function useTaskDeleteMutation() {
  return useMutation({
    mutationFn: async (variable: { meta: { tasklistId: string; taskId: string } }) => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.delete({
        tasklist: variable.meta.tasklistId,
        task: variable.meta.taskId,
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
    onSuccess: invalidateTasksCache,
  })
}

async function invalidateTasksCache(_data: unknown, variable: { meta: { tasklistId: string } }) {
  await globalQueryClient.invalidateQueries({
    queryKey: ['tasklists', variable.meta.tasklistId],
  })
}
