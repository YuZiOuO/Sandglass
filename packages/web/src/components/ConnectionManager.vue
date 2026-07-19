<script setup lang="ts">
import { onMounted, ref } from 'vue'

import type { Capability } from '../core/capability'
import { GoogleConnection } from '../connections/google'

const capabilities = ref<readonly Capability[]>([])
const loading = ref(true)
const connected = ref(false)
const error = ref('')
let connection: GoogleConnection

async function connect() {
  loading.value = true
  error.value = ''

  try {
    await connection.set()
    capabilities.value = connection.capabilities
    connected.value = true
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Google auth failed.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    connection = new GoogleConnection()

    if ((await connection.check()) || (await connection.resume())) {
      capabilities.value = connection.capabilities
      connected.value = true
    }
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Google auth failed.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main>
    <header>
      <p v-if="loading">Loading...</p>
      <p v-else-if="connected">Google connected.</p>
      <p v-else-if="error">{{ error }}</p>
      <p v-else>Google is not connected.</p>
      <button v-if="!loading" type="button" @click="connect">
        {{ connected ? 'Reconnect Google' : 'Connect Google' }}
      </button>
    </header>
    <slot v-if="connected" :capabilities="capabilities" />
  </main>
</template>
