<script setup lang="ts">
import { NConfigProvider, NNotificationProvider, dateZhCN, zhCN } from 'naive-ui'
import {
  CalendarOutline,
  CheckboxOutline,
  FolderOpenOutline,
  LogoGithub,
  MailOutline,
  TimeOutline,
} from '@vicons/ionicons5'
import { ref, shallowReactive, shallowRef } from 'vue'

import type { GithubConnection } from './adapter/github'
import type { GoogleConnection } from './adapter/google'
import { AttendanceAdapter } from './adapter/static/attendance'
import type { AttendanceState } from './adapter/static/attendance'
import ConnectionManager from './components/ConnectionManager.vue'
import DashboardShell, {
  createDefaultDashboardState,
  type ConnectionStatus,
  type SyncStatus,
} from './components/DashboardShell.vue'
import SyncManager from './components/SyncManager.vue'
import { createPlugin, createState } from './lib'
import AttendancePlugin from './plugins/attendance/AttendancePlugin.vue'
import CalendarPlugin from './plugins/calendar/CalendarPlugin.vue'
import MailPlugin from './plugins/mail/MailPlugin.vue'
import ProjectPlugin, {
  type ProjectCapabilities,
  type ProjectState,
} from './plugins/project/ProjectPlugin.vue'
import RepoPlugin from './plugins/repo/RepoPlugin.vue'
import TasksPlugin from './plugins/tasks/TasksPlugin.vue'

const googleConnection = shallowRef<GoogleConnection>()
const githubConnection = shallowRef<GithubConnection>()
const connectionStatus = ref<ConnectionStatus>('checking')
const syncStatus = ref<SyncStatus>('idle')
const projectCapabilities = shallowReactive<ProjectCapabilities>({})
const dashboard = createState('dashboard', createDefaultDashboardState)

const attendance = createPlugin({
  id: 'attendance',
  profile: {
    title: '考勤',
    icon: TimeOutline,
    layout: { w: 4, h: 8, minW: 3, minH: 7 },
  },
  state: (): AttendanceState => ({ records: [] }),
  capabilities: (state) => [new AttendanceAdapter(state)] as const,
  component: AttendancePlugin,
})
const project = createPlugin({
  id: 'project',
  profile: {
    title: '项目',
    icon: FolderOpenOutline,
    layout: { w: 8, h: 8, minW: 6, minH: 6 },
  },
  state: (): ProjectState => ({ projects: [] }),
  capabilities: () => [projectCapabilities] as const,
  component: ProjectPlugin,
})
const mail = createPlugin({
  id: 'mail',
  profile: {
    title: '邮件',
    icon: MailOutline,
    layout: { w: 6, h: 8, minW: 5, minH: 6 },
  },
  unavailableText: '连接 Google 后可用。',
  capabilities: () =>
    googleConnection.value ? ([googleConnection.value.mailCapability] as const) : undefined,
  component: MailPlugin,
})
const calendar = createPlugin({
  id: 'calendar',
  profile: {
    title: '日历',
    icon: CalendarOutline,
    layout: { w: 4, h: 6, minW: 4, minH: 5 },
  },
  unavailableText: '连接 Google 后可用。',
  capabilities: () =>
    googleConnection.value ? ([googleConnection.value.calendarCapability] as const) : undefined,
  component: CalendarPlugin,
})
const tasks = createPlugin({
  id: 'tasks',
  profile: {
    title: '任务',
    icon: CheckboxOutline,
    layout: { w: 4, h: 6, minW: 3, minH: 5 },
  },
  unavailableText: '连接 Google 后可用。',
  capabilities: () =>
    googleConnection.value ? ([googleConnection.value.taskCapability] as const) : undefined,
  component: TasksPlugin,
})
const repo = createPlugin({
  id: 'repo',
  profile: {
    title: 'GitHub 动态',
    icon: LogoGithub,
    layout: { w: 6, h: 6, minW: 5, minH: 5 },
  },
  unavailableText: '连接 GitHub 后可用。',
  capabilities: () =>
    githubConnection.value
      ? ([
          githubConnection.value.repoCapability,
          githubConnection.value.repositoryCapability,
        ] as const)
      : undefined,
  component: RepoPlugin,
})

const plugins = [attendance, project, mail, calendar, tasks, repo] as const
// SAFETY: attendance and project both provide state factories, so their sync sources exist.
const syncSources = [dashboard.syncSource, attendance.syncSource!, project.syncSource!] as const

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
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-notification-provider>
      <DashboardShell
        :plugins="plugins"
        :state="dashboard.state"
        :connection-status="connectionStatus"
        :sync-status="syncStatus"
      >
        <template #connections>
          <ConnectionManager @ready="setConnections" @status="connectionStatus = $event" />
        </template>
        <template #sync>
          <SyncManager :sources="syncSources" @status="syncStatus = $event" />
        </template>
      </DashboardShell>
    </n-notification-provider>
  </n-config-provider>
</template>

<style>
html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

body {
  min-width: 320px;
  background: #f5f7f9;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
