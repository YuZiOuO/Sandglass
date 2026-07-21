import type {
  CalendarCapability,
  CalendarEvent,
  CalendarEventTime,
  CalendarRange,
  CreateCalendarEventInput,
  UpdateCalendarEventInput,
} from '@/capability/calendar'
import type { Scope, Scoped } from '@/interfaces'

const CALENDAR_API_ROOT = 'https://www.googleapis.com/calendar/v3'

type GoogleCalendarListPage = {
  items: Array<{ id: string; summary: string }>
  nextPageToken?: string
}

type GoogleEvent = {
  id: string
  summary: string
  description?: string
  start: { date?: string; dateTime?: string }
  end: { date?: string; dateTime?: string }
}

type GoogleEventPage = {
  items: GoogleEvent[]
  nextPageToken?: string
}

export class GoogleCalendarCapability implements Scoped<CalendarCapability> {
  constructor(
    private readonly request: (url: string | URL, init?: RequestInit) => Promise<Response>,
  ) {}

  async listScopes() {
    const scopes: Scope[] = []
    const url = new URL(`${CALENDAR_API_ROOT}/users/me/calendarList`)
    let pageToken: string | undefined

    do {
      if (pageToken) url.searchParams.set('pageToken', pageToken)
      const response = await this.request(url)
      const page = (await response.json()) as GoogleCalendarListPage
      scopes.push(...page.items.map(({ id, summary }) => ({ id, name: summary })))
      pageToken = page.nextPageToken
    } while (pageToken)

    return scopes
  }

  forScope(id: string) {
    return new GoogleCalendar(this.request, id)
  }
}

class GoogleCalendar implements CalendarCapability {
  constructor(
    private readonly request: (url: string | URL, init?: RequestInit) => Promise<Response>,
    private readonly calendarId: string,
  ) {}

  async list(range: CalendarRange) {
    const events: CalendarEvent[] = []
    const url = this.eventsUrl()
    url.searchParams.set('timeMin', range.from.toISOString())
    url.searchParams.set('timeMax', range.to.toISOString())
    // Expand provider recurrence so the domain model only sees concrete events.
    url.searchParams.set('singleEvents', 'true')
    url.searchParams.set('orderBy', 'startTime')
    let pageToken: string | undefined

    do {
      if (pageToken) url.searchParams.set('pageToken', pageToken)
      const response = await this.request(url)
      const page = (await response.json()) as GoogleEventPage
      events.push(...page.items.map(fromGoogleEvent))
      pageToken = page.nextPageToken
    } while (pageToken)

    return events
  }

  async create(input: CreateCalendarEventInput) {
    const response = await this.request(this.eventsUrl(), {
      method: 'POST',
      body: JSON.stringify(toGoogleEvent(input)),
    })
    return fromGoogleEvent((await response.json()) as GoogleEvent)
  }

  async update(id: string, patch: UpdateCalendarEventInput) {
    const response = await this.request(this.eventUrl(id), {
      method: 'PATCH',
      body: JSON.stringify(toGoogleEvent(patch)),
    })
    return fromGoogleEvent((await response.json()) as GoogleEvent)
  }

  async remove(id: string) {
    await this.request(this.eventUrl(id), { method: 'DELETE' })
  }

  private eventsUrl() {
    return new URL(`${CALENDAR_API_ROOT}/calendars/${encodeURIComponent(this.calendarId)}/events`)
  }

  private eventUrl(id: string) {
    return `${this.eventsUrl()}/${encodeURIComponent(id)}`
  }
}

function fromGoogleEvent(event: GoogleEvent): CalendarEvent {
  return {
    id: event.id,
    title: event.summary,
    ...(event.description === undefined ? {} : { description: event.description }),
    time: fromGoogleEventTime(event),
  }
}

function fromGoogleEventTime(event: GoogleEvent): CalendarEventTime {
  if ('date' in event.start) {
    return { startDate: event.start.date!, endDate: event.end.date! }
  }

  return { startAt: new Date(event.start.dateTime!), endAt: new Date(event.end.dateTime!) }
}

function toGoogleEvent(input: CreateCalendarEventInput | UpdateCalendarEventInput) {
  return {
    ...(input.title === undefined ? {} : { summary: input.title }),
    ...(input.description === undefined ? {} : { description: input.description }),
    ...(input.time === undefined ? {} : toGoogleEventTime(input.time)),
  }
}

function toGoogleEventTime(time: CalendarEventTime) {
  return 'startAt' in time
    ? {
        start: { dateTime: time.startAt.toISOString() },
        end: { dateTime: time.endAt.toISOString() },
      }
    : {
        start: { date: time.startDate },
        end: { date: time.endDate },
      }
}
