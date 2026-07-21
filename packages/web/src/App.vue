<script setup lang="ts">
import { NGrid, NGridItem, NNotificationProvider } from 'naive-ui'
import { computed, shallowRef } from 'vue'

import type { GoogleConnection } from './adapter/google'
import ConnectionManager from './components/ConnectionManager.vue'
import { AttendanceAdapter } from './adapter/static/attendance'
import type { AttendanceState } from './adapter/static/attendance'
import AttendancePanel from './plugins/attendance/AttendancePanel.vue'
import CalendarPlugin from './plugins/calendar/CalendarPlugin.vue'
import MailPanel from './plugins/mail/MailPanel.vue'
import TasksPlugin from './plugins/tasks/TasksPlugin.vue'
import SyncManager from './components/SyncManager.vue'
import { createPlugin } from './lib'

const attendance = createPlugin({
  id: 'attendance',
  state: (): AttendanceState => ({ records: [] }),
  capabilities: (state) => [new AttendanceAdapter(state)] as const,
  component: AttendancePanel,
})
const syncSources = [attendance.syncSource!] as const
const googleConnection = shallowRef<GoogleConnection>()
const plugins = computed(() => {
  const connection = googleConnection.value
  if (!connection) return [attendance]

  return [
    attendance,
    createPlugin({
      id: 'mail',
      capabilities: () => [connection.mailCapability] as const,
      component: MailPanel,
    }),
    createPlugin({
      id: 'calendar',
      capabilities: () => [connection.calendarCapability] as const,
      component: CalendarPlugin,
    }),
    createPlugin({
      id: 'tasks',
      capabilities: () => [connection.taskCapability] as const,
      component: TasksPlugin,
    }),
  ]
})

function setConnections(value: { google?: GoogleConnection }) {
  googleConnection.value = value.google
}
</script>

<template>
  <n-notification-provider>
    <main class="app-shell">
      <n-grid cols="1 s:2" responsive="screen" :x-gap="16" :y-gap="16">
        <n-grid-item>
          <ConnectionManager @ready="setConnections" />
        </n-grid-item>
        <n-grid-item>
          <SyncManager :sources="syncSources" />
        </n-grid-item>
        <n-grid-item v-for="plugin in plugins" :key="plugin.id">
          <component :is="plugin.component" />
        </n-grid-item>
      </n-grid>
    </main>
  </n-notification-provider>
</template>

<style>
.app-shell {
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px;
}
</style>
