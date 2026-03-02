import { useQuery } from '@tanstack/vue-query'
import { queryGoogle } from './google'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { isGoogleTokenAvailable } from './google'

const baseURL = 'https://www.googleapis.com/calendar/v3'

export const googleCalendarKeys = {
  namespace: ['google', 'calendars'] as const,
  calendarLists: () => [...googleCalendarKeys.namespace, 'lists'] as const,
  events: (calendarId: string) => [...googleCalendarKeys.namespace, 'events', calendarId],
}

export function useGoogleCalendarListQuery() {
  return useQuery({
    queryKey: googleCalendarKeys.calendarLists(),
    queryFn: async () =>
      queryGoogle<gapi.client.calendar.CalendarList>(baseURL + '/users/me/calendarList'),
    enabled: computed(() => isGoogleTokenAvailable.value),
  })
}

export function useGoogleCalendarEventsQuery(calendarId: MaybeRefOrGetter<string>) {
  const id = computed(() => toValue(calendarId))

  return useQuery({
    queryKey: computed(() => googleCalendarKeys.events(id.value)),
    queryFn: async () =>
      queryGoogle<gapi.client.calendar.Events>(
        baseURL + `/calendars/${encodeURIComponent(id.value)}/events`,
      ),
    enabled: computed(() => isGoogleTokenAvailable.value && !!id.value),
  })
}
