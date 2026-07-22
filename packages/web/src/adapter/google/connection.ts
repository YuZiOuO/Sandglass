import { cli } from '@/lib'
import { GoogleCalendarCapability } from './calendar'
import { GoogleMailCapability } from './mail'
import { GoogleTaskCapability } from './task'
import type { CalendarCapability } from '@/capability/calendar'
import type { TaskCapability } from '@/capability/task'
import type { Capability, Connection, MutableScoped } from '@/interfaces'

export class GoogleConnection implements Connection {
  readonly capabilities: readonly Capability[]
  readonly calendarCapability: MutableScoped<CalendarCapability>
  readonly mailCapability: GoogleMailCapability
  readonly taskCapability: MutableScoped<TaskCapability>
  private accessToken = ''

  constructor() {
    const request = this.request.bind(this)

    this.calendarCapability = new GoogleCalendarCapability(request)
    this.mailCapability = new GoogleMailCapability(request)
    this.taskCapability = new GoogleTaskCapability(request)
    this.capabilities = [this.calendarCapability, this.mailCapability, this.taskCapability]
  }

  private getRequestHeaders() {
    if (!this.accessToken) {
      throw new Error('Google is not authenticated.')
    }

    return { Authorization: `Bearer ${this.accessToken}` }
  }

  private async request(url: string | URL, init?: RequestInit) {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...this.getRequestHeaders(),
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      },
    })

    if (!response.ok) {
      throw new Error(`Google API request failed (${response.status}).`)
    }

    return response
  }

  authorize() {
    globalThis.location.assign(cli.google.authorize.$url().toString())
  }

  async restore() {
    const response = await cli.google['access-token'].$post(
      {},
      {
        init: {
          credentials: 'include',
        },
      },
    )

    if (!response.ok) {
      this.accessToken = ''
      return false
    }

    const { authenticated, accessToken } = await response.json()
    this.accessToken = accessToken

    return authenticated
  }
}
