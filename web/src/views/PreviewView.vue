<template>
  <div class="root">
    <ProjectDetailModule :project-data="undefined" :events="undefined" :tasks-data="[]" />
  </div>
</template>
<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import { useCalendarQuery, useEventListQuery } from '@/services-composable/google-calendar'
import { useTasksQuery } from '@/services-composable/google-tasks'
import { ref, toRef } from 'vue'

const id = ref<string>('cyz050312@gmail.com')

const calendar = useCalendarQuery(id)
const tasks = useTasksQuery(toRef('THFmWkdRbC1GN0VzbTZfWQ'))
const events = useEventListQuery(id)
</script>

<style lang="css" scoped>
.root {
  display: flex;
}
</style>
