<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  NAlert,
  NButton,
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NEmpty,
  NSpace,
  NSpin,
} from 'naive-ui'

import type { Connection } from '@/interfaces'
import { GithubConnection } from '../adapter/github'
import { GoogleConnection } from '../adapter/google'

type ManagedConnection = {
  name: string
  connection: Connection
  loading: boolean
  connected: boolean
  error: string
}

const googleConnection = new GoogleConnection()
const githubConnection = new GithubConnection()
const connections = ref<ManagedConnection[]>([
  {
    name: 'Google',
    connection: googleConnection,
    loading: true,
    connected: false,
    error: '',
  },
  {
    name: 'GitHub',
    connection: githubConnection,
    loading: true,
    connected: false,
    error: '',
  },
])

const emit = defineEmits<{
  ready: [connections: { google?: GoogleConnection; github?: GithubConnection }]
}>()

function authorize(item: ManagedConnection) {
  item.error = ''
  item.connection.authorize()
}

onMounted(async () => {
  await Promise.all(
    connections.value.map(async (item) => {
      try {
        item.connected = await item.connection.restore()
      } catch (cause) {
        item.error = cause instanceof Error ? cause.message : `${item.name} auth failed.`
      } finally {
        item.loading = false
      }
    }),
  )

  emit('ready', {
    google: connections.value[0]?.connected ? googleConnection : undefined,
    github: connections.value[1]?.connected ? githubConnection : undefined,
  })
})
</script>

<template>
  <n-space vertical size="small">
    <n-card v-for="item in connections" :key="item.name" size="small" :title="item.name">
      <template #header-extra>
        <n-button v-if="!item.loading" size="small" type="primary" @click="authorize(item)">
          {{ item.connected ? `Reconnect ${item.name}` : `Connect ${item.name}` }}
        </n-button>
      </template>

      <n-spin :show="item.loading">
        <n-descriptions label-placement="left" :column="1" size="small">
          <n-descriptions-item label="Provider">{{ item.name }}</n-descriptions-item>
          <n-descriptions-item label="Status">
            {{
              item.loading
                ? 'Checking'
                : item.connected
                  ? 'Connected'
                  : item.error
                    ? 'Connection failed'
                    : 'Not connected'
            }}
          </n-descriptions-item>
          <n-descriptions-item v-if="item.connected" label="Capabilities">
            {{ item.connection.capabilities.length }}
          </n-descriptions-item>
        </n-descriptions>
        <n-alert v-if="item.error" type="error" :title="item.error" />
        <n-empty
          v-else-if="!item.connected"
          description="Connect this provider to enable its capabilities."
        />
        <n-empty v-else description="Connection active." />
      </n-spin>
    </n-card>
  </n-space>
</template>
