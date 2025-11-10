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
  <NButton
    @click="
      async () => {
        if (authStore.uid === null) {
          throw new Error()
        }
        await createProject.mutateAsync({
          uid: authStore.uid,
          calendarId: inputCalendarId,
          tasklistId: inputTasklistId,
        })
      }
    "
    :loading="createProject.isPending.value"
    >createProject</NButton
  >

  <NInput v-model:value="inputGetProjectId" :type="'text'" placeholder="ProjectId"></NInput>
  <NButton
    @click="
      async () => {
        await project.refetch()
      }
    "
    :loading="project.isFetching.value"
    >getProject</NButton
  >
  <NCollapse>
    <NCollapseItem
      v-for="field in Object.entries(project.data.value === undefined ? {} : project.data.value)"
      :key="field[0]?.toString()"
      :title="field[0]"
    >
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>

  <NInput v-model:value="inputDeleteProjectId" :type="'text'" placeholder="ProjectId"></NInput>
  <NButton
    @click="
      async () => {
        await deleteProject.mutateAsync(inputDeleteProjectId)
      }
    "
    :loading="project.isFetching.value"
    >deleteProject
  </NButton>
  <NText>{{ deleteProject.status }}</NText>
</template>
<script setup lang="ts">
import {
  useCreateProject,
  useDeleteProject,
  useProjectQuery,
  useProjectsQuery,
} from '@/services-composable/project'
import { useAuthenticationStore } from '@/stores/authentication'
import { NButton, NInput, NText, NCollapse, NCollapseItem } from 'naive-ui'
import { ref } from 'vue'

const inputCalendarId = ref<string>('')
const inputTasklistId = ref<string>('')
const inputGetProjectId = ref<string>('')
const inputDeleteProjectId = ref<string>('')

const authStore = useAuthenticationStore()
const projects = useProjectsQuery()
const project = useProjectQuery(inputGetProjectId)
const createProject = useCreateProject()
const deleteProject = useDeleteProject()
</script>
