<script setup lang="ts">
import { NGrid, NGridItem, NNotificationProvider } from 'naive-ui'
import { computed, shallowReactive, shallowRef } from 'vue'

import type { GithubConnection } from './adapter/github'
import type { GoogleConnection } from './adapter/google'
import ConnectionManager from './components/ConnectionManager.vue'
import { AttendanceAdapter } from './adapter/static/attendance'
import type { AttendanceState } from './adapter/static/attendance'
import AttendancePanel from './plugins/attendance/AttendancePanel.vue'
import CalendarPlugin from './plugins/calendar/CalendarPlugin.vue'
import MailPanel from './plugins/mail/MailPanel.vue'
import ProjectPlugin, {
  type ProjectCapabilities,
  type ProjectState,
} from './plugins/project/ProjectPlugin.vue'
import RepoPlugin from './plugins/repo/RepoPlugin.vue'
import TasksPlugin from './plugins/tasks/TasksPlugin.vue'
import SyncManager from './components/SyncManager.vue'
import { createPlugin } from './lib'

const attendance = createPlugin({
  id: 'attendance',
  state: (): AttendanceState => ({ records: [] }),
  capabilities: (state) => [new AttendanceAdapter(state)] as const,
  component: AttendancePanel,
})
const projectCapabilities = shallowReactive<ProjectCapabilities>({})
const project = createPlugin({
  id: 'project',
  state: (): ProjectState => ({ projects: [] }),
  capabilities: () => [projectCapabilities] as const,
  component: ProjectPlugin,
})
const syncSources = [attendance.syncSource!, project.syncSource!] as const
const googleConnection = shallowRef<GoogleConnection>()
const githubConnection = shallowRef<GithubConnection>()
const plugins = computed(() => {
  const google = googleConnection.value
  const github = githubConnection.value

  return [
    attendance,
    project,
    ...(google
      ? [
          createPlugin({
            id: 'mail',
            capabilities: () => [google.mailCapability] as const,
            component: MailPanel,
          }),
          createPlugin({
            id: 'calendar',
            capabilities: () => [google.calendarCapability] as const,
            component: CalendarPlugin,
          }),
          createPlugin({
            id: 'tasks',
            capabilities: () => [google.taskCapability] as const,
            component: TasksPlugin,
          }),
        ]
      : []),
    ...(github
      ? [
          createPlugin({
            id: 'repo',
            capabilities: () => [github.repoCapability, github.repositoryCapability] as const,
            component: RepoPlugin,
          }),
        ]
      : []),
  ]
})

function setConnections(value: { google?: GoogleConnection; github?: GithubConnection }) {
  googleConnection.value = value.google
  githubConnection.value = value.github
  projectCapabilities.repo = value.github?.repoCapability
  projectCapabilities.repositories = value.github?.repositoryCapability
  projectCapabilities.calendars = value.google?.calendarCapability
  projectCapabilities.tasks = value.google?.taskCapability
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
