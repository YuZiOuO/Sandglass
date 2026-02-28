<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NGrid, NGridItem, NFlex, NCard, NTabs, NTabPane, NSplit } from 'naive-ui'
import { useProjectQuery } from '@/services-composable/project'

import ProjectTasksModule from './ProjectTasksModule.vue'
import ProjectCalendarModule from './ProjectCalendarModule.vue'
import ProjectResourcesModule from './ProjectResourcesModule.vue'
import ProjectEditorModule from './ProjectEditorModule.vue'
import ProjectFlowModule from './ProjectFlowModule.vue'
import ProjectHeatmapModule from './ProjectHeatmapModule.vue'
import ProjectWeeklyFocusChart from './ProjectWeeklyFocusChart.vue'
import AttendanceActionsModule from '../attendance/AttendanceActionsModule.vue'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const project = useProjectQuery(projectId)
</script>

<template>
  <n-grid x-gap="12" :cols="24">
    <n-grid-item span="16">
      <NSplit>
        <template #1>
          <NSplit direction="vertical">
            <template #1>
              <ProjectTasksModule :tasklist-id="project.data.value?.tasklistId" />
            </template>
            <template #2>
              <ProjectResourcesModule :project-id="projectId" />
            </template>
          </NSplit>
        </template>
        <template #2>
          <n-tabs type="line" animated style="padding: 10px">
            <n-tab-pane name="stat" tab="统计">
              <ProjectHeatmapModule
                :owner="project.data.value?.repoOwner"
                :repo="project.data.value?.repoName"
              />
              <ProjectWeeklyFocusChart :project-id="projectId" />
            </n-tab-pane>
            <n-tab-pane name="editor" tab="工作区">
              <ProjectEditorModule />
            </n-tab-pane>
            <n-tab-pane name="calendar" tab="日历">
              <ProjectCalendarModule :calendar-id="project.data.value?.calendarId" />
            </n-tab-pane>
          </n-tabs>
        </template>
      </NSplit>
    </n-grid-item>

    <n-grid-item span="8">
      <NFlex>
        <NCard>
          <AttendanceActionsModule :project-id="projectId" />
        </NCard>
        <ProjectFlowModule :calendar-id="project.data.value?.calendarId" :project-id="projectId" />
      </NFlex>
    </n-grid-item>
  </n-grid>
</template>
