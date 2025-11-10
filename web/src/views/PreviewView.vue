<template>
  <div class="root">
    <ProjectDetailModule
      :project-data="project.data.value"
      :events="events.data.value"
      :tasks-data="tasks.data.value?.items"
    />
  </div>
</template>
<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import { useEventListQuery } from '@/services-composable/google-calendar'
import { useTasksQuery } from '@/services-composable/google-tasks'
import { useProjectQuery } from '@/services-composable/project'
import { computed, ref } from 'vue'

const projectId = ref<string>('69118ea137dcd654bc85ce65')

const project = useProjectQuery(projectId)

const calnedarId = computed(() => project.data.value?.calendarId ?? '')
const tasklistId = computed(() => project.data.value?.tasklistId ?? '')

const tasks = useTasksQuery(tasklistId)
const events = useEventListQuery(calnedarId)
</script>

<style lang="css" scoped>
.root {
  display: flex;
}
</style>
