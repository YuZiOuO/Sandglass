<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NGrid, NGridItem, NFlex, NCard, NTabs, NTabPane, NSplit, NScrollbar } from 'naive-ui'
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
  <NGrid class="project-board-grid" x-gap="12" y-gap="12" item-responsive responsive="screen">
    <NGridItem span="24 m:16" class="col-wrapper">
      <NCard class="flex-col-fill" content-class="flex-col-fill" content-style="padding: 0;" :bordered="true">
        <NSplit :default-size="0.35" style="flex: 1">
          <template #1>
            <NSplit direction="vertical" :default-size="0.5">
              <template #1>
                <NScrollbar class="task-panel-bg">
                  <div style="padding: 16px;">
                    <ProjectTasksModule :tasklist-id="project.data.value?.tasklistId" />
                  </div>
                </NScrollbar>
              </template>
              <template #2>
                <NScrollbar class="resource-panel-bg">
                  <div style="padding: 16px;">
                    <ProjectResourcesModule :project-id="projectId" />
                  </div>
                </NScrollbar>
              </template>
            </NSplit>
          </template>
          <template #2>
            <NTabs 
              type="line" 
              animated 
              class="tabs-container"
              pane-style="flex: 1; overflow-y: auto; padding-top: 12px; padding-bottom: 12px;"
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

    <NGridItem span="24 m:8" class="col-wrapper">
      <NFlex vertical class="flex-col-fill" :wrap="false">
        <NCard :bordered="true">
          <AttendanceActionsModule :project-id="projectId" />
        </NCard>
        <ProjectFlowModule
          class="flex-col-fill"
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

<style>
/* 
 * 移除 scoped，将这些类上升为全局的 Utility Classes（原子类）。
 * 因为 Vue 的 scoped 特性无法穿透到 Naive-UI 的 `content-class` 内部 DOM 节点中，导致样式断层。
 */
.project-board-grid {
  flex: 1;
  min-height: 0;
  align-items: stretch;
}

/* 列级包装器，禁止行高被内部元素反向拉伸 */
.col-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* 核心灵魂 CSS，实现万能的：占满全高 + flex布局向下传递 + 锁定不溢出 */
.flex-col-fill {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

/* 局部外观微调 */
.task-panel-bg {
  background-color: var(--n-action-color);
  height: 100%;
}
.resource-panel-bg {
  border-top: 1px solid var(--n-border-color);
  height: 100%;
}
.tabs-container {
  padding: 0 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
