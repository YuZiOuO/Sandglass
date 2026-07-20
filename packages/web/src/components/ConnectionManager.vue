<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
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

import type { Capability, Connection } from '@/interfaces'
import { GithubConnection } from '../adapter/github'
import { GoogleConnection } from '../adapter/google'

type ManagedConnection = {
  name: string
  connection: Connection
  loading: boolean
  connected: boolean
  error: string
}

const connections = ref<ManagedConnection[]>([
  {
    name: 'Google',
    connection: new GoogleConnection(),
    loading: true,
    connected: false,
    error: '',
  },
  {
    name: 'GitHub',
    connection: new GithubConnection(),
    loading: true,
    connected: false,
    error: '',
  },
])

const emit = defineEmits<{
  ready: [capabilities: readonly Capability[]]
}>()

const capabilities = computed(() =>
  connections.value
    .filter(({ connected }) => connected)
    .flatMap(({ connection }) => connection.capabilities),
)

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

  emit('ready', capabilities.value)
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
