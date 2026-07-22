<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { NAlert, NButton, NDescriptions, NDescriptionsItem, NSpace, NTag } from 'naive-ui'

import type { JsonObject, StatePort } from '@/interfaces'
import { cli } from '@/lib'

const { sources } = defineProps<{
  sources: readonly {
    id: string
    port: StatePort<JsonObject>
  }[]
}>()
const emit = defineEmits<{
  status: [status: 'idle' | 'syncing' | 'synced' | 'conflict' | 'error']
}>()

const hash = ref<string>()
const updatedAt = ref<string>()
const status = ref<'idle' | 'syncing' | 'synced' | 'conflict' | 'error'>('idle')
const error = ref('')
const lastAction = ref<'pull' | 'push'>()

const statusLabel = computed(
  () =>
    ({ idle: '就绪', syncing: '同步中', synced: '已同步', conflict: '有冲突', error: '出错' })[
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
  lastAction.value = 'push'
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

onMounted(() => void pull())
watch(status, (value) => emit('status', value), { immediate: true })
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-button
        :disabled="status === 'syncing'"
        :loading="status === 'syncing' && lastAction === 'pull'"
        @click="pull"
      >
        拉取
      </n-button>
      <n-button
        type="primary"
        :disabled="status === 'syncing'"
        :loading="status === 'syncing' && lastAction === 'push'"
        @click="push"
      >
        推送
      </n-button>
      <n-tag :type="statusType">{{ statusLabel }}</n-tag>
    </n-space>
    <n-alert v-if="error" type="error" :title="error" />
    <n-descriptions :column="1" size="small">
      <n-descriptions-item label="远端快照">{{ hash ? '可用' : '无' }}</n-descriptions-item>
      <n-descriptions-item label="本地数据源">{{ sources.length }}</n-descriptions-item>
      <n-descriptions-item label="远端哈希">{{ hash ?? '无' }}</n-descriptions-item>
      <n-descriptions-item label="远端更新时间">{{ updatedAt ?? '无' }}</n-descriptions-item>
    </n-descriptions>
  </n-space>
</template>
