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
        :selected="selectedProjectId"
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
        :project-data="undefined"
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
import { useProjectsQuery } from '@/services-composable/project'
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui'
import { ref, toRef, type Ref } from 'vue'

const selectedProjectId = ref<string | undefined>()
const projectList = useProjectsQuery()

const calendar = useCalendarQuery(selectedProjectId as Ref<string>)
const tasks = useTasksQuery(toRef('cyz050312@gmail.com'))
</script>
