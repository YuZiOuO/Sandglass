import { authCli } from "./common"

export const defaultEnabled = () => !!authCli.useSession().value.data?.user.id
export async function fetchGoogleApi<T>(endpoint: string) {
  const token = await authCli.getAccessToken({ providerId: 'google' })

  if (token.error || !token.data.accessToken) {
    return null
  }

  const res = await fetch(endpoint, { headers: { Authorization: 'Bearer ' + token } })
  const data = (await res.json()) as T

  return data
}
