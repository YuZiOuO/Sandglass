import { authCli } from './common'

export const defaultEnabled = () => !!authCli.useSession().value.data?.user.id
export async function fetchGoogleApiRaw<T>(endpoint: string, method?: string, body?: Partial<T>) {
  const token = await authCli.getAccessToken({ providerId: 'google' })

  if (token.error || !token.data.accessToken) {
    return null
  }

  const res = await fetch(endpoint, {
    method: method,
    headers: {
      Authorization: 'Bearer ' + token.data.accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as T

  return data
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
