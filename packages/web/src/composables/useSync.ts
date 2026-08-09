import { ref } from 'vue'
import type { JsonObject, StatePort } from '@/interfaces'
import { cli } from '@/lib'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'conflict' | 'error'

export function useSync(sources: readonly { id: string; port: StatePort<JsonObject> }[]) {
  const hash = ref<string | undefined>()
  const updatedAt = ref<string | undefined>()
  const status = ref<SyncStatus>('idle')
  const error = ref('')

  async function pull() {
    status.value = 'syncing'
    error.value = ''
    try {
      const response = await cli.sync.$get({}, { init: { credentials: 'include' } })
      if (!response.ok) throw new Error('同步请求失败。')

      const { snapshot } = await response.json()
      if (snapshot) {
        for (const source of sources) {
          const value = snapshot.data[source.id] as JsonObject | undefined
          if (value) source.port.write(value)
        }
        hash.value = snapshot.hash
        updatedAt.value = snapshot.updatedAt
      } else {
        hash.value = undefined
        updatedAt.value = undefined
      }
      status.value = 'synced'
    } catch (cause) {
      status.value = 'error'
      error.value = cause instanceof Error ? cause.message : '同步失败。'
    }
  }

  async function push() {
    status.value = 'syncing'
    error.value = ''
    try {
      const data = Object.fromEntries(sources.map(({ id, port }) => [id, port.read()]))
      const response = await cli.sync.$put(
        { json: { baseHash: hash.value, data } },
        { init: { credentials: 'include' } },
      )
      if (response.status === 409) {
        status.value = 'conflict'
        error.value = '远端数据已变化，请先拉取并确认后再继续。'
        return
      }
      if (!response.ok) throw new Error('同步请求失败。')

      const { snapshot } = await response.json()
      hash.value = snapshot.hash
      updatedAt.value = snapshot.updatedAt
      status.value = 'synced'
    } catch (cause) {
      status.value = 'error'
      error.value = cause instanceof Error ? cause.message : '同步失败。'
    }
  }

  return { hash, updatedAt, status, error, pull, push, sourcesCount: sources.length }
}
