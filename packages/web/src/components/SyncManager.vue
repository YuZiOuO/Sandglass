<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NAlert, NButton, NCard, NDescriptions, NDescriptionsItem, NSpace, NTag } from 'naive-ui'

import type { JsonObject, StatePort } from '@/interfaces'
import { cli } from '@/lib'

type SyncSource = {
  id: string
  port: StatePort<JsonObject>
}

const { sources } = defineProps<{
  sources: readonly SyncSource[]
}>()

const hash = ref<string>()
const updatedAt = ref<string>()
const status = ref<'idle' | 'syncing' | 'synced' | 'conflict' | 'error'>('idle')
const error = ref('')
const lastAction = ref<'pull' | 'push'>()

const statusLabel = computed(
  () =>
    ({ idle: 'Ready', syncing: 'Syncing', synced: 'Synced', conflict: 'Conflict', error: 'Error' })[
      status.value
    ],
)
const statusType = computed(() =>
  status.value === 'error' || status.value === 'conflict'
    ? 'error'
    : status.value === 'synced'
      ? 'success'
      : 'default',
)

async function pull() {
  status.value = 'syncing'
  error.value = ''
  lastAction.value = 'pull'
  try {
    const response = await cli.sync.$get({}, { init: { credentials: 'include' } })
    if (!response.ok) throw new Error('Sync request failed.')

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
    error.value = cause instanceof Error ? cause.message : 'Sync failed.'
  }
}

async function push() {
  status.value = 'syncing'
  error.value = ''
  lastAction.value = 'push'
  try {
    const data = Object.fromEntries(sources.map(({ id, port }) => [id, port.read()]))
    const response = await cli.sync.$put(
      { json: { baseHash: hash.value, data } },
      { init: { credentials: 'include' } },
    )
    if (response.status === 409) {
      status.value = 'conflict'
      error.value = 'The remote snapshot changed. Pull to review it before continuing.'
      return
    }
    if (!response.ok) throw new Error('Sync request failed.')

    const { snapshot } = await response.json()
    hash.value = snapshot.hash
    updatedAt.value = snapshot.updatedAt
    status.value = 'synced'
  } catch (cause) {
    status.value = 'error'
    error.value = cause instanceof Error ? cause.message : 'Sync failed.'
  }
}

onMounted(() => void pull())
</script>

<template>
  <n-card title="Sync">
    <n-space vertical>
      <n-space>
        <n-button
          :disabled="status === 'syncing'"
          :loading="status === 'syncing' && lastAction === 'pull'"
          @click="pull"
        >
          Pull
        </n-button>
        <n-button
          type="primary"
          :disabled="status === 'syncing'"
          :loading="status === 'syncing' && lastAction === 'push'"
          @click="push"
        >
          Push
        </n-button>
        <n-tag :type="statusType">
          {{ statusLabel }}
        </n-tag>
      </n-space>
      <n-alert v-if="error" type="error" :title="error" />
      <n-descriptions :column="1" size="small">
        <n-descriptions-item label="Remote snapshot">
          {{ hash ? 'Available' : 'None' }}
        </n-descriptions-item>
        <n-descriptions-item label="Local sources">{{ sources.length }}</n-descriptions-item>
        <n-descriptions-item label="Remote hash">{{ hash ?? 'None' }}</n-descriptions-item>
        <n-descriptions-item label="Remote updated">{{ updatedAt ?? 'None' }}</n-descriptions-item>
      </n-descriptions>
    </n-space>
  </n-card>
</template>
