<script setup lang="ts">
import { NGi, NGrid, NNotificationProvider, NSpace } from 'naive-ui'
import { computed, h, shallowRef } from 'vue'

import type { GoogleConnection } from './adapter/google'
import ConnectionManager from './components/ConnectionManager.vue'
import { LocalAttendanceAdapter } from './adapter/local/attendance'
import AttendancePanel from './plugins/attendance/AttendancePanel.vue'
import CalendarPlugin from './plugins/calendar/CalendarPlugin.vue'
import MailPanel from './plugins/mail/MailPanel.vue'
import TasksPlugin from './plugins/tasks/TasksPlugin.vue'

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
      <n-grid cols="1 m:2" x-gap="16" y-gap="16">
        <n-gi>
          <CalendarPlugin :capability="googleConnection?.calendarCapability" />
        </n-gi>
        <n-gi>
          <TasksPlugin :capability="googleConnection?.taskCapability" />
        </n-gi>
      </n-grid>
      <component :is="plugin.component" v-for="plugin in plugins" :key="plugin.id" />
    </n-space>
  </n-notification-provider>
</template>
