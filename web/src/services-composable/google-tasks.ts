import { useGApi } from '@/hooks/gapi'
import { useMutation, useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

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
    queryKey: ['taskslists', taskListId, 'tasks'],
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

export function useTaskAddMutation(meta: { tasklistId: string }, task: gapi.client.tasks.Task) {
  return useMutation({
    mutationFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.insert(
        {
          tasklist: meta.tasklistId,
          oauth_token: await useGoogleAccessToken(),
        },
        task,
      )

      return (await req).result
    },
  })
}

export function useTaskPatchMutation(
  meta: { tasklistId: string; taskId: string },
  task: gapi.client.tasks.Task,
) {
  return useMutation({
    mutationFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.patch(
        {
          tasklist: meta.tasklistId,
          task: meta.taskId,
          oauth_token: await useGoogleAccessToken(),
        },
        task,
      )

      return (await req).result
    },
  })
}

export function useTaskDeleteMutation(meta: { tasklistId: string; taskId: string }) {
  return useMutation({
    mutationFn: async () => {
      await useGApi(['tasks'])
      const req = gapi.client.tasks.tasks.delete({
        tasklist: meta.tasklistId,
        task: meta.taskId,
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}
