<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  NAlert,
  NButton,
  NDescriptions,
  NDescriptionsItem,
  NDivider,
  NFlex,
  NSpin,
  NTag,
} from 'naive-ui'

import type { Connection } from '@/interfaces'
import { GithubConnection } from '../adapter/github'
import { GoogleConnection } from '../adapter/google'

const googleConnection = new GoogleConnection()
const githubConnection = new GithubConnection()
const connections = ref<
  {
    name: string
    connection: Connection
    loading: boolean
    connected: boolean
    error: string
  }[]
>([
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
  status: [status: 'checking' | 'ready' | 'partial' | 'error']
}>()

function authorize(item: (typeof connections.value)[number]) {
  item.error = ''
  item.connection.authorize()
}

onMounted(async () => {
  emit('status', 'checking')
  await Promise.all(
    connections.value.map(async (item) => {
      try {
        item.connected = await item.connection.restore()
      } catch (cause) {
        item.error = cause instanceof Error ? cause.message : `${item.name} 授权失败。`
      } finally {
        item.loading = false
      }
    }),
  )

  emit('ready', {
    google: connections.value[0]?.connected ? googleConnection : undefined,
    github: connections.value[1]?.connected ? githubConnection : undefined,
  })
  const connected = connections.value.filter((item) => item.connected).length
  emit(
    'status',
    connected === connections.value.length
      ? 'ready'
      : connected > 0
        ? 'partial'
        : connections.value.some((item) => item.error)
          ? 'error'
          : 'partial',
  )
})
</script>

<template>
  <div>
    <section v-for="(item, index) in connections" :key="item.name">
      <n-divider v-if="index" />
      <n-flex align="center" justify="space-between">
        <strong>{{ item.name }}</strong>
        <n-button v-if="!item.loading" size="small" type="primary" @click="authorize(item)">
          {{ item.connected ? '重新连接' : '连接' }}
        </n-button>
      </n-flex>

      <n-spin :show="item.loading">
        <n-descriptions label-placement="left" :column="1" size="small" style="margin-top: 12px">
          <n-descriptions-item label="状态">
            <n-tag
              size="small"
              :bordered="false"
              :type="item.connected ? 'success' : item.error ? 'error' : 'default'"
            >
              {{
                item.loading
                  ? '检查中'
                  : item.connected
                    ? '已连接'
                    : item.error
                      ? '连接失败'
                      : '未连接'
              }}
            </n-tag>
          </n-descriptions-item>
          <n-descriptions-item v-if="item.connected" label="可用能力">
            {{ item.connection.capabilities.length }} 项
          </n-descriptions-item>
        </n-descriptions>
        <n-alert v-if="item.error" type="error" :title="item.error" />
      </n-spin>
    </section>
  </div>
</template>
