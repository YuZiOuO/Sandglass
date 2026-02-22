<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NGrid, NGridItem, NFlex } from 'naive-ui'
import { useProjectQuery } from '@/services-composable/project'

import ProjectTasksModule from './ProjectTasksModule.vue'
import ProjectCalendarModule from './ProjectCalendarModule.vue'
import ProjectResourcesModule from './ProjectResourcesModule.vue'
import ProjectEditorModule from './ProjectEditorModule.vue'
import ProjectFlowModule from './ProjectFlowModule.vue'
import ProjectStatusModule from './ProjectStatusModule.vue'
import ProjectHeatmapModule from './ProjectHeatmapModule.vue'

const route = useRoute()
const projectId = computed(() => route.params.id as string)
const project = useProjectQuery(projectId)
</script>

<template>
  <div class="project-view p-4 h-full">
    {{ project.fetchStatus }}
    {{ project.data.value }}
    <n-grid x-gap="12" :cols="24" class="h-full">
      <n-grid-item span="6" class="flex flex-col gap-4">
        <NFlex>
          <ProjectTasksModule :tasklist-id="project.data.value?.tasklistId" />
          <ProjectCalendarModule :calendar-id="project.data.value?.calendarId"/>
          <ProjectResourcesModule :project-id="projectId" />
        </NFlex>
      </n-grid-item>

      <n-grid-item span="12" class="h-full">
        <ProjectEditorModule />
      </n-grid-item>

      <n-grid-item span="6" class="flex flex-col gap-4">
        <NFlex>
          <ProjectFlowModule :calendar-id="project.data.value?.calendarId" />
          <ProjectStatusModule />
          <ProjectHeatmapModule />
        </NFlex>
      </n-grid-item>
    </n-grid>
  </div>
</template>
