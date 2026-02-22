<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NGrid, NGridItem, NFlex, NCard, NTabs, NTabPane } from 'naive-ui'
import { useProjectQuery } from '@/services-composable/project'

import ProjectTasksModule from './ProjectTasksModule.vue'
import ProjectCalendarModule from './ProjectCalendarModule.vue'
import ProjectResourcesModule from './ProjectResourcesModule.vue'
import ProjectEditorModule from './ProjectEditorModule.vue'
import ProjectFlowModule from './ProjectFlowModule.vue'
import ProjectHeatmapModule from './ProjectHeatmapModule.vue'
import AttendanceActionsModule from '../attandance/AttendanceActionsModule.vue'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const project = useProjectQuery(projectId)
</script>

<template>
  <div class="project-view p-4 h-full">
    {{ project.fetchStatus }}
    {{ project.data.value }}
    <n-grid x-gap="12" :cols="24" class="h-full">
      <n-grid-item span="4" class="flex flex-col gap-4">
        <NFlex>
          <ProjectTasksModule :tasklist-id="project.data.value?.tasklistId" />
          <ProjectResourcesModule :project-id="projectId" />
        </NFlex>
      </n-grid-item>

      <n-grid-item span="12" class="h-full">
        <NCard>
          <n-tabs type="line" animated>
            <n-tab-pane name="stat" tab="统计">
              <ProjectHeatmapModule />
              and Others...
            </n-tab-pane>
            <n-tab-pane name="editor" tab="工作区">
              <ProjectEditorModule />
            </n-tab-pane>
            <n-tab-pane name="calendar" tab="日历">
              <ProjectCalendarModule :calendar-id="project.data.value?.calendarId" />
            </n-tab-pane>
          </n-tabs>
        </NCard>
      </n-grid-item>

      <n-grid-item span="8" class="flex flex-col gap-4">
        <NFlex>
          <NCard>
            <AttendanceActionsModule />
          </NCard>
          <ProjectFlowModule :calendar-id="project.data.value?.calendarId" />
        </NFlex>
      </n-grid-item>
    </n-grid>
  </div>
</template>
