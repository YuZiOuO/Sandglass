import { useGApi } from '@/hooks/gapi'
import { useQuery } from '@tanstack/vue-query'
import { useGoogleAccessToken } from './google-oauth'

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

export function useCalendarQuery(calendarId: string) {
  return useQuery({
    queryKey: ['calendar', calendarId],
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
