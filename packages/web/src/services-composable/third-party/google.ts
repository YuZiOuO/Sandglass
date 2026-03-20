import { computed } from 'vue'
import { authCli } from '../common'

export const isGoogleTokenAvailable = computed(() => !!authCli.useSession().value.data?.user)

async function fetchGoogleApiRaw<T>(endpoint: string, method?: string, body?: Partial<T>) {
  const token = await authCli.getAccessToken({ providerId: 'google' })

  if (token.error || !token.data.accessToken) {
    const err = new Error('failed to retrive access token.')
    err.name = 'Google API Error'
    throw err
  }

  const res = await fetch(endpoint, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token.data.accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (res.ok) {
    if (res.status === 204) {
      // 204 No Content has no body. Calling .json() on it will throw a SyntaxError.
      return {} as T
    }
    return (await res.json()) as T
  } else {
    const err = new Error(res.status + ' ' + res.statusText)
    err.name = 'Google API Error'
    throw err
  }
}

export async function queryGoogle<T>(endpoint: string) {
  return await fetchGoogleApiRaw<T>(endpoint)
}

export async function postGoogle<T>(endpoint: string, body: T) {
  return await fetchGoogleApiRaw<T>(endpoint, 'POST', body)
}

export async function patchGoogle<T>(endpoint: string, body: Partial<T>) {
  return await fetchGoogleApiRaw<T>(endpoint, 'PATCH', body)
}

export async function deleteGoogle<T>(endpoint: string) {
  return await fetchGoogleApiRaw<T>(endpoint, 'DELETE')
}
