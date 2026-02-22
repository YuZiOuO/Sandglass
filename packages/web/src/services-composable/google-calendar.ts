import { useQuery } from '@tanstack/vue-query'
import { queryGoogle } from './common-google'
import { toValue, type MaybeRefOrGetter } from 'vue'

const baseURL = 'https://www.googleapis.com/calendar/v3'

export function useGoogleCalendarListQuery() {
  return useQuery({
    queryKey: ['google', 'calendar'],
    queryFn: async () =>
      queryGoogle<gapi.client.calendar.CalendarList>(baseURL + '/users/me/calendarList'),
  })
}

export function useGoogleCalendarEventsQuery(calendarId: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: ['google', 'calendar', calendarId],
    queryFn: async () =>
      queryGoogle<gapi.client.calendar.Events>(
        baseURL + `/calendars/${encodeURIComponent(toValue(calendarId))}/events`,
      ),
  })
}
