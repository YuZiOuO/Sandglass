<script setup lang="ts">
import {
  CalendarOutline,
  CheckboxOutline,
  FolderOpenOutline,
  LogoGithub,
  MailOutline,
  TimeOutline,
} from '@vicons/ionicons5'
import { NConfigProvider, NNotificationProvider, dateZhCN, zhCN } from 'naive-ui'

import { AttendanceAdapter } from './adapter/static/attendance'
import type { AttendanceState } from './adapter/static/attendance'
import ConnectionManager from './components/ConnectionManager.vue'
import DashboardShell, { createDefaultDashboardState } from './components/DashboardShell.vue'
import SyncManager from './components/SyncManager.vue'
import { useConnection } from './composables/useConnection'
import { useSync } from './composables/useSync'
import { createPlugin, createState } from './lib'
import type { ProjectState } from './plugins/project/ProjectPlugin.vue'
import AttendancePlugin from './plugins/attendance/AttendancePlugin.vue'
import CalendarPlugin from './plugins/calendar/CalendarPlugin.vue'
import MailPlugin from './plugins/mail/MailPlugin.vue'
import ProjectPlugin from './plugins/project/ProjectPlugin.vue'
import RepoPlugin from './plugins/repo/RepoPlugin.vue'
import TasksPlugin from './plugins/tasks/TasksPlugin.vue'

const { items, connections, status: connectionStatus, restore, authorize } = useConnection()

const dashboard = createState('dashboard', createDefaultDashboardState)

const attendance = createPlugin({
  id: 'attendance',
  profile: { title: '考勤', icon: TimeOutline, layout: { w: 4, h: 8, minW: 3, minH: 7 } },
  state: (): AttendanceState => ({ records: [] }),
  capabilities: (state) => [new AttendanceAdapter(state)] as const,
  component: AttendancePlugin,
})
const project = createPlugin({
  id: 'project',
  profile: { title: '项目', icon: FolderOpenOutline, layout: { w: 8, h: 8, minW: 6, minH: 6 } },
  state: (): ProjectState => ({ projects: [] }),
  capabilities: () => {
    const { google, github } = connections.value
    if (!google && !github) return undefined
    return [
      {
        repo: github?.repoCapability,
        repositories: github?.repositoryCapability,
        calendars: google?.calendarCapability,
        tasks: google?.taskCapability,
      },
    ] as const
  },
  component: ProjectPlugin,
})
const mail = createPlugin({
  id: 'mail',
  profile: { title: '邮件', icon: MailOutline, layout: { w: 6, h: 8, minW: 5, minH: 6 } },
  unavailableText: '连接 Google 后可用。',
  capabilities: () =>
    connections.value.google ? ([connections.value.google.mailCapability] as const) : undefined,
  component: MailPlugin,
})
const calendar = createPlugin({
  id: 'calendar',
  profile: { title: '日历', icon: CalendarOutline, layout: { w: 4, h: 6, minW: 4, minH: 5 } },
  unavailableText: '连接 Google 后可用。',
  capabilities: () =>
    connections.value.google ? ([connections.value.google.calendarCapability] as const) : undefined,
  component: CalendarPlugin,
})
const tasks = createPlugin({
  id: 'tasks',
  profile: { title: '任务', icon: CheckboxOutline, layout: { w: 4, h: 6, minW: 3, minH: 5 } },
  unavailableText: '连接 Google 后可用。',
  capabilities: () =>
    connections.value.google ? ([connections.value.google.taskCapability] as const) : undefined,
  component: TasksPlugin,
})
const repo = createPlugin({
  id: 'repo',
  profile: { title: 'GitHub 动态', icon: LogoGithub, layout: { w: 6, h: 6, minW: 5, minH: 5 } },
  unavailableText: '连接 GitHub 后可用。',
  capabilities: () =>
    connections.value.github
      ? ([
          connections.value.github.repoCapability,
          connections.value.github.repositoryCapability,
        ] as const)
      : undefined,
  component: RepoPlugin,
})

const plugins = [attendance, project, mail, calendar, tasks, repo] as const
const syncSources = [dashboard.syncSource, attendance.syncSource!, project.syncSource!] as const

const {
  hash,
  updatedAt,
  status: syncStatus,
  error,
  sourcesCount,
  pull,
  push,
} = useSync(syncSources)

restore()
pull()
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
          <ConnectionManager :items="items" @authorize="authorize" />
        </template>
        <template #sync>
          <SyncManager
            :hash="hash"
            :updated-at="updatedAt"
            :status="syncStatus"
            :error="error"
            :sources-count="sourcesCount"
            @pull="pull"
            @push="push"
          />
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
