import type { Capability } from '@/interfaces'

export interface CalendarCapability extends Capability {
  list: (range: CalendarRange) => Promise<readonly CalendarEvent[]>
  create: (input: CreateCalendarEventInput) => Promise<CalendarEvent>
  update: (id: string, patch: UpdateCalendarEventInput) => Promise<CalendarEvent>
  remove: (id: string) => Promise<void>
}

export type CalendarRange = {
  from: Date
  to: Date
}

// Recurrence metadata is intentionally omitted from the initial contract.
export type CalendarEvent = {
  id: string
  title: string
  description?: string
  time: CalendarEventTime
}

export type CalendarEventTime =
  | {
      startAt: Date
      endAt: Date
    }
  | {
      startDate: string
      endDate: string
    }

export type CreateCalendarEventInput = Omit<CalendarEvent, 'id'>
export type UpdateCalendarEventInput = Partial<CreateCalendarEventInput>
