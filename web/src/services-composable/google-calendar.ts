import { useGApi } from '@/hooks/gapi'
import { useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'
import { computed, type Ref } from 'vue'

export function useCalendarListQuery() {
  return useQuery({
    queryKey: ['calendar'],
    queryFn: async () => {
      await useGApi(['calendar'])
      const req = gapi.client.calendar.calendarList.list({
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}

export function useCalendarQuery(calendarId: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['calendar', calendarId]),
    queryFn: async (context) => {
      await useGApi(['calendar'])
      const req = gapi.client.calendar.calendars.get({
        calendarId: context.queryKey[1],
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}

export function useEventListQuery(calendarId: Ref<string>) {
  return useQuery({
    queryKey: ['calendar', calendarId, 'event'],
    queryFn: async (context) => {
      await useGApi(['calendar'])
      const id = context.queryKey[1]
      const req = gapi.client.calendar.events.list({
        calendarId: id,
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
  })
}
