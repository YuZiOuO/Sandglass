import type { Capability } from '../../core/capability'
import type { Connection } from '../../core/connection'
import { requestGoogleAccessToken } from './gis'
import { GoogleMailCapability } from './mail'

const GOOGLE_SCOPE =
  'https://mail.google.com/ https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/tasks'
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_ACCESS_TOKEN_STORAGE_KEY = 'google-access-token'
const storage = globalThis.localStorage

export class GoogleConnection implements Connection {
  readonly capabilities: readonly Capability[]
  private readonly mailCapability: GoogleMailCapability

  constructor() {
    this.mailCapability = new GoogleMailCapability(() => {
      const accessToken = storage.getItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY)
      if (!accessToken) {
        throw new Error('Google is not authenticated.')
      }

      return {
        Authorization: `Bearer ${accessToken}`,
      }
    })
    this.capabilities = [this.mailCapability]
  }

  async set() {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error('Google is not configured.')
    }

    const accessToken = await requestGoogleAccessToken(GOOGLE_CLIENT_ID, GOOGLE_SCOPE, 'consent')
    if (!accessToken) {
      throw new Error('Failed to get Google access token.')
    }

    storage.setItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY, accessToken)
  }

  async resume() {
    if (!GOOGLE_CLIENT_ID) {
      return false
    }

    const accessToken = await requestGoogleAccessToken(GOOGLE_CLIENT_ID, GOOGLE_SCOPE, '')

    if (!accessToken) {
      return false
    }

    storage.setItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY, accessToken)
    return true
  }

  async check() {
    const accessToken = storage.getItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY)
    if (!accessToken) {
      return false
    }

    const valid = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => response.ok)
      .catch(() => false)

    if (!valid) {
      storage.removeItem(GOOGLE_ACCESS_TOKEN_STORAGE_KEY)
    }
    return valid
  }
}
