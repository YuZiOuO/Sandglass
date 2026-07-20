<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { NAlert, NButton, NCard, NDescriptions, NDescriptionsItem, NEmpty, NSpin } from 'naive-ui'

import type { Capability } from '../core/capability'
import { GoogleConnection } from '../connections/google'

const loading = ref(true)
const connected = ref(false)
const error = ref('')
let connection: GoogleConnection
const emit = defineEmits<{
  ready: [capabilities: readonly Capability[]]
}>()

function setConnected() {
  connected.value = true
  emit('ready', connection.capabilities)
}

const status = computed(() => {
  if (loading.value) {
    return 'Checking'
  }
  if (connected.value) {
    return 'Connected'
  }
  if (error.value) {
    return 'Connection failed'
  }
  return 'Not connected'
})

function connect() {
  error.value = ''
  connection.authorize()
}

onMounted(async () => {
  try {
    connection = new GoogleConnection()

    if (await connection.restore()) {
      setConnected()
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Google auth failed.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <n-card size="small" title="Google">
    <template #header-extra>
      <n-button v-if="!loading" size="small" type="primary" @click="connect">
        {{ connected ? 'Reconnect Google' : 'Connect Google' }}
      </n-button>
    </template>

    <n-spin :show="loading">
      <n-descriptions label-placement="left" :column="1" size="small">
        <n-descriptions-item label="Provider">Google</n-descriptions-item>
        <n-descriptions-item label="Status">{{ status }}</n-descriptions-item>
        <n-descriptions-item v-if="connected" label="Capabilities">
          {{ connection.capabilities.length }}
        </n-descriptions-item>
      </n-descriptions>
      <n-alert v-if="error" type="error" :title="error" />
      <n-empty v-else-if="!connected" description="Connect Google to enable its capabilities." />
      <n-empty v-else description="Google connected." />
    </n-spin>
  </n-card>
</template>
