<template>
  <NLayout has-sider>
    <NLayoutSider
      collapse-mode="width"
      :collapsed-width="120"
      :width="240"
      show-trigger="arrow-circle"
      content-style="padding: 24px;"
      bordered
    >
      <ProjectSummaryListModule
        v-model:selected="selectedProjectId"
        :project-list="projectList.data.value"
        @create="
          () => {
            console.log('aaa')
          }
        "
      />
    </NLayoutSider>
    <NLayoutContent>
      <ProjectDetailModule
        :project-data="project.data.value"
        :events="calendar.data.value"
        :tasks-data="tasks.data.value?.items"
    /></NLayoutContent>
  </NLayout>
</template>

<script setup lang="ts">
import ProjectDetailModule from '@/components/module/project/ProjectDetailModule.vue'
import ProjectSummaryListModule from '@/components/module/projectlist/projectSummaryListModule.vue'
import { useCalendarQuery } from '@/services-composable/google-calendar'
import { useTasksQuery } from '@/services-composable/google-tasks'
import { useProjectQuery, useProjectsQuery } from '@/services-composable/project'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import { computed, ref } from 'vue'

const projectList = useProjectsQuery()
const selectedProjectId = ref<string | undefined>()

const project = useProjectQuery(computed(() => selectedProjectId.value ?? ''))

const calendar = useCalendarQuery(computed(() => project.data.value?.calendarId ?? ''))
const tasks = useTasksQuery(computed(() => project.data.value?.tasklistId ?? ''))
</script>
