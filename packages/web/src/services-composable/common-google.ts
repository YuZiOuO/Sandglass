import { authCli } from './common'

export const defaultEnabled = () => !!authCli.useSession().value.data?.user.id
export async function fetchGoogleApiRaw<T>(endpoint: string, method?: string, body?: T) {
  const token = await authCli.getAccessToken({ providerId: 'google' })

  if (token.error || !token.data.accessToken) {
    return null
  }

  const res = await fetch(endpoint, {
    method: method,
    headers: { Authorization: 'Bearer ' + token.data.accessToken },
    body: JSON.stringify(body),
  })
  const data = (await res.json()) as T

  return data
}

export async function queryGoogle<T>(endpoint: string) {
  return await fetchGoogleApiRaw<T>(endpoint)
}

export async function mutateGoogle<T>(endpoint: string, body: T) {
  return await fetchGoogleApiRaw<T>(endpoint, 'POST', body)
}
