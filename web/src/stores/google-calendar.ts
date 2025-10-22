import { defineStore } from 'pinia'
import { useOAuthStore } from './oauth'
import { useGApi } from '@/hooks/gapi'

export const useGoogleCalendarStore = defineStore('google-calendar', () => {
  const oauthStore = useOAuthStore()

  async function listCalendar() {
    await useGApi(['calendar'])
    const req = gapi.client.calendar.calendarList.list({
      oauth_token: await oauthStore.getGoogleAccessToken(),
    })

    return (await req).result
  }

  async function getCalendar(calendarId: string) {
    const req = gapi.client.calendar.calendars.get({
      calendarId: calendarId,
      oauth_token: await oauthStore.getGoogleAccessToken(),
    })

    return (await req).result
  }

  return { listCalendar, getCalendar }
})
