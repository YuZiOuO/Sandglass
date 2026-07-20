<script setup lang="ts">
import { NNotificationProvider, NSpace } from 'naive-ui'
import { computed, h, shallowRef } from 'vue'

import type { GoogleConnection } from './adapter/google'
import ConnectionManager from './components/ConnectionManager.vue'
import { LocalAttendanceAdapter } from './adapter/local/attendance'
import AttendancePanel from './plugins/attendance/AttendancePanel.vue'
import MailPanel from './plugins/mail/MailPanel.vue'

const attendanceCapability = new LocalAttendanceAdapter()
const googleConnection = shallowRef<GoogleConnection>()
const plugins = computed(() => {
  const attendance = {
    id: 'attendance',
    component: () => h(AttendancePanel, { capabilities: [attendanceCapability] as const }),
  }
  const connection = googleConnection.value
  const mail = connection && {
    id: 'mail',
    component: () => h(MailPanel, { capabilities: [connection.mailCapability] as const }),
  }

  return mail ? [attendance, mail] : [attendance]
})

function setConnections(value: { google?: GoogleConnection }) {
  googleConnection.value = value.google
}
</script>

<template>
  <n-notification-provider>
    <n-space vertical size="large">
      <ConnectionManager @ready="setConnections" />
      <component :is="plugin.component" v-for="plugin in plugins" :key="plugin.id" />
    </n-space>
  </n-notification-provider>
</template>
