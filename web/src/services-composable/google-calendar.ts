import { useGApi } from '@/hooks/gapi'
import { useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'
import { computed, toValue, type MaybeRefOrGetter, type Ref } from 'vue'

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
    enabled: calendarId.value.length > 0,
  })
}

export function useEventListQuery(calendarId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['calendar', calendarId, 'event'],
    queryFn: async () => {
      await useGApi(['calendar'])
      const req = gapi.client.calendar.events.list({
        calendarId: toValue(calendarId),
        oauth_token: await useGoogleAccessToken(),
      })

      return (await req).result
    },
    enabled: computed(() => toValue(calendarId).length > 0),
  })
}
