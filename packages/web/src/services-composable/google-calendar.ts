import { useQuery } from '@tanstack/vue-query'
import { fetchGoogleApi } from './common-google'

const baseURL = 'https://www.googleapis.com/calendar/v3'

export function useGoogleCalendarListQuery() {
  return useQuery({
    queryKey: ['google', 'calendar'],
    queryFn: async () =>
      fetchGoogleApi<gapi.client.calendar.CalendarList>(baseURL + '/users/me/calendarList'),
  })
}

export function useGoogleCalendarEventsQuery(calendarId: string) {
  return useQuery({
    queryKey: ['google', 'calendar', calendarId],
    queryFn: async () =>
      fetchGoogleApi<gapi.client.calendar.Calendar>(baseURL + `/calendars/${calendarId}/events`),
  })
}
