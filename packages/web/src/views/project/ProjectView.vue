<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NGrid, NGridItem, NFlex, NCard, NTabs, NTabPane, NSplit } from 'naive-ui'
import { useProjectQuery } from '@/services-composable/project'

import ProjectTasksModule from './modules/ProjectTasksModule.vue'
import ProjectCalendarModule from './modules/ProjectCalendarModule.vue'
import ProjectResourcesModule from './modules/ProjectResourcesModule.vue'
import ProjectEditorModule from './modules/ProjectEditorModule.vue'
import ProjectFlowModule from './modules/ProjectFlowModule.vue'
import ProjectHeatmapModule from './modules/ProjectHeatmapModule.vue'
import ProjectWeeklyFocusChart from './modules/ProjectFocusChartModule.vue'
import AttendanceActionsModule from '../attendance/modules/AttendanceActionsModule.vue'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const project = useProjectQuery(projectId)
</script>

<template>
  <NGrid class="flex-1 min-h-0 items-stretch" x-gap="12" y-gap="12" item-responsive responsive="screen">
    <NGridItem span="24 m:16" class="flex flex-col min-h-0">
      <NCard class="flex-1 min-h-0" content-class="flex flex-col flex-1 min-h-0" content-style="padding: 0;" :bordered="true">
        <NSplit :default-size="0.35" style="flex: 1">
          <template #1>
            <NSplit direction="vertical" :default-size="0.5">
              <template #1>
                <NLayout class="h-full" style="background: transparent;">
                  <NCard embedded :bordered="false" class="h-full" content-style="padding: 16px;">
                    <ProjectTasksModule :tasklist-id="project.data.value?.tasklistId" />
                  </NCard>
                </NLayout>
              </template>
              <template #2>
                <NLayout class="h-full border-t border-[var(--n-border-color)]" style="background: transparent;">
                  <NCard :bordered="false" class="h-full" content-style="padding: 16px;">
                    <ProjectResourcesModule :project-id="projectId" />
                  </NCard>
                </NLayout>
              </template>
            </NSplit>
          </template>
          <template #2>
            <NTabs 
              type="line" 
              animated 
              class="h-full flex flex-col"
              style="padding: 0 16px;"
              pane-class="flex-1 overflow-y-auto"
              pane-style="padding: 12px 0;"
            >
              <NTabPane name="stat" tab="统计">
                <ProjectHeatmapModule
                  :owner="project.data.value?.repoOwner"
                  :repo="project.data.value?.repoName"
                />
                <ProjectWeeklyFocusChart :project-id="projectId" />
              </NTabPane>
              <NTabPane name="editor" tab="工作区">
                <ProjectEditorModule />
              </NTabPane>
              <NTabPane name="calendar" tab="日历">
                <ProjectCalendarModule :calendar-id="project.data.value?.calendarId" />
              </NTabPane>
            </NTabs>
          </template>
        </NSplit>
      </NCard>
    </NGridItem>

    <NGridItem span="24 m:8" class="flex flex-col min-h-0">
      <NFlex vertical class="flex-1 min-h-0" :wrap="false">
        <NCard :bordered="true">
          <AttendanceActionsModule :project-id="projectId" />
        </NCard>
        <ProjectFlowModule
          class="flex-1 min-h-0"
          :config="{
            attendance: {
              projectId: projectId,
            },
            github: {
              owner: project.data.value?.repoOwner,
              repo: project.data.value?.repoName,
            },
            googleCalendar: {
              calendarId: project.data.value?.calendarId,
            },
            googleTask: {
              TasklistId: project.data.value?.tasklistId,
            },
          }"
        />
      </NFlex>
    </NGridItem>
  </NGrid>
</template>
