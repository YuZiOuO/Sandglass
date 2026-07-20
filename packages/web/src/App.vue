<script setup lang="ts">
import { NNotificationProvider, NSpace } from 'naive-ui'
import { ref } from 'vue'

import type { Capability, Plugin } from './interfaces'
import ConnectionManager from './components/ConnectionManager.vue'
import MailPanel from './plugins/mail/MailPanel.vue'

const plugins: Plugin[] = [MailPanel]
const capabilities = ref<readonly Capability[]>([])

function setCapabilities(value: readonly Capability[]) {
  capabilities.value = value
}
</script>

<template>
  <n-notification-provider>
    <n-space vertical size="large">
      <ConnectionManager @ready="setCapabilities" />
      <template v-for="plugin in plugins" :key="plugin">
        <component v-if="capabilities.length" :is="plugin" :capabilities="capabilities" />
      </template>
    </n-space>
  </n-notification-provider>
</template>
