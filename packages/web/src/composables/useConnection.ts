import { computed, reactive } from 'vue'
import { GithubConnection } from '../adapter/github'
import { GoogleConnection } from '../adapter/google'

export type Provider = 'google' | 'github'

export type ConnectionStatus = 'checking' | 'ready' | 'partial' | 'error'

export interface ConnectionItem {
  name: string
  provider: Provider
  loading: boolean
  connected: boolean
  error: string
  capabilityCount: number
}

export function useConnection() {
  const google = new GoogleConnection()
  const github = new GithubConnection()

  const byProvider = { google, github } as const

  const items = reactive<ConnectionItem[]>([
    {
      name: 'Google',
      provider: 'google',
      loading: true,
      connected: false,
      error: '',
      capabilityCount: google.capabilities.length,
    },
    {
      name: 'GitHub',
      provider: 'github',
      loading: true,
      connected: false,
      error: '',
      capabilityCount: github.capabilities.length,
    },
  ])

  const connections = computed(() => ({
    google: items[0]!.connected ? google : undefined,
    github: items[1]!.connected ? github : undefined,
  }))

  const status = computed<ConnectionStatus>(() => {
    if (items.some((i) => i.loading)) return 'checking'
    const connected = items.filter((i) => i.connected).length
    return connected === items.length ? 'ready' : connected > 0 ? 'partial' : 'error'
  })

  async function restore() {
    await Promise.all(
      items.map(async (item) => {
        const conn = byProvider[item.provider]
        try {
          item.connected = await conn.restore()
        } catch (cause) {
          item.error = cause instanceof Error ? cause.message : `${item.name} 授权失败。`
        } finally {
          item.loading = false
        }
      }),
    )
  }

  function authorize(provider: Provider) {
    const item = items.find((i) => i.provider === provider)!
    item.error = ''
    byProvider[provider].authorize()
  }

  return { items, connections, status, restore, authorize }
}
