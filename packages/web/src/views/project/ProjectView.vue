<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { NGrid, NGridItem } from 'naive-ui'
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

// --- Data Fetching (Project Info only) ---
// Modules handle their own specific data fetching now.
const { data: project } = useProjectQuery(projectId)

const tasklistId = computed(() => project.value?.tasklistId)
const calendarId = computed(() => project.value?.calendarId)

</script>

<template>
  <div class="project-view p-4 h-full">
    <n-grid x-gap="12" y-gap="12" :cols="24" class="h-full">
      <!-- COLUMN 1: Tasks, Calendar, Resources -->
      <n-grid-item span="24 m:6" class="flex flex-col gap-4">
        
        <!-- 1. Tasks -->
        <ProjectTasksModule :tasklist-id="tasklistId" />

        <!-- 4. Calendar -->
        <ProjectCalendarModule />

        <!-- 5. Resources -->
        <ProjectResourcesModule :project-id="projectId" />

      </n-grid-item>

      <!-- COLUMN 2: Editor -->
      <n-grid-item span="24 m:12" class="h-full">
        <ProjectEditorModule />
      </n-grid-item>

      <!-- COLUMN 3: Flow & Heatmap -->
      <n-grid-item span="24 m:6" class="flex flex-col gap-4">
        
        <!-- 3. Flow -->
        <ProjectFlowModule :calendar-id="calendarId" />

        <!-- Punch Card -->
        <ProjectStatusModule />

        <!-- Heatmap -->
        <ProjectHeatmapModule />

      </n-grid-item>
    </n-grid>
  </div>
</template>

<style scoped>
/* Minor utility overrides if needed specifically for this view */
</style>
