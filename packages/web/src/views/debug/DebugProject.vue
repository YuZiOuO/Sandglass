<template>
  <NButton
    @click="
      async () => {
        await projects.refetch()
      }
    "
    :loading="projects.isFetching.value"
  >
    refreshProjectList
  </NButton>
  <NText>{{ projects.data }}</NText>

  <NInput v-model:value="inputCalendarId" :type="'text'" placeholder="CalendarId"></NInput>
  <NInput v-model:value="inputTasklistId" :type="'text'" placeholder="TasklistId"></NInput>
  <NButton @click="() => {}">createProject</NButton>

  <NInput v-model:value="inputProjectId" :type="'text'" placeholder="ProjectId"></NInput>
  <NButton @click="() => {}">getProject</NButton>
  <NCollapse>
    <NCollapseItem
      v-for="field in Object.entries(project.data === undefined ? new Object() : project.data)"
      :key="field[0]?.toString()"
      :title="field[0]"
    >
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
</template>
<script setup lang="ts">
import { useProjectQuery, useProjectsQuery } from '@/services-composable/project'
import { NButton, NInput, NText, NCollapse, NCollapseItem } from 'naive-ui'
import { ref } from 'vue'

const inputCalendarId = ref<string>('')
const inputTasklistId = ref<string>('')
const inputProjectId = ref<string>('')

const projects = useProjectsQuery()
const project = useProjectQuery(inputProjectId)
</script>
