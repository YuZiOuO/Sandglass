<script setup lang="ts">
import { computed, ref } from 'vue'
import { NAlert, NButton, NDescriptions, NDescriptionsItem, NSpace, NTag } from 'naive-ui'
import type { SyncStatus } from '../composables/useSync'

const { hash, updatedAt, status, error, sourcesCount } = defineProps<{
  hash?: string
  updatedAt?: string
  status: SyncStatus
  error: string
  sourcesCount: number
}>()

const emit = defineEmits<{
  pull: []
  push: []
}>()

const lastAction = ref<'pull' | 'push'>()

function onPull() {
  lastAction.value = 'pull'
  emit('pull')
}

function onPush() {
  lastAction.value = 'push'
  emit('push')
}

const statusLabel = computed(
  () =>
    ({ idle: '就绪', syncing: '同步中', synced: '已同步', conflict: '有冲突', error: '出错' })[
      status
    ],
)
const statusType = computed(() =>
  status === 'error' || status === 'conflict'
    ? 'error'
    : status === 'synced'
      ? 'success'
      : 'default',
)
</script>

<template>
  <n-space vertical>
    <n-space>
      <n-button
        :disabled="status === 'syncing'"
        :loading="status === 'syncing' && lastAction === 'pull'"
        @click="onPull"
      >
        拉取
      </n-button>
      <n-button
        type="primary"
        :disabled="status === 'syncing'"
        :loading="status === 'syncing' && lastAction === 'push'"
        @click="onPush"
      >
        推送
      </n-button>
      <n-tag :type="statusType">{{ statusLabel }}</n-tag>
    </n-space>
    <n-alert v-if="error" type="error" :title="error" />
    <n-descriptions :column="1" size="small">
      <n-descriptions-item label="远端快照">{{ hash ? '可用' : '无' }}</n-descriptions-item>
      <n-descriptions-item label="本地数据源">{{ sourcesCount }}</n-descriptions-item>
      <n-descriptions-item label="远端哈希">{{ hash ?? '无' }}</n-descriptions-item>
      <n-descriptions-item label="远端更新时间">{{ updatedAt ?? '无' }}</n-descriptions-item>
    </n-descriptions>
  </n-space>
</template>
