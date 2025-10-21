<template>
  <NButton
    @click="
      async () => {
        refreshProjectListLoadingStatus = true
        await projectStore.refreshProjectList()
        refreshProjectListLoadingStatus = false
      }
    "
    :loading="refreshProjectListLoadingStatus"
  >
    refreshProjectList
  </NButton>
  <NButton
    @click="
      async () => {
        cachedProjectList = await projectStore.getProjectList()
      }
    "
  >
    getProjectList
  </NButton>
  <NText>{{ cachedProjectList }}</NText>

  <NInput v-model:value="inputCalendarId" :type="'text'" placeholder="CalendarId"></NInput>
  <NInput v-model:value="inputTasklistId" :type="'text'" placeholder="TasklistId"></NInput>
  <NButton
    @click="
      async () => {
        if (inputCalendarId === '' || inputTasklistId === '') {
          throw new Error()
        }
        await projectStore.createProject(inputCalendarId, inputTasklistId)
      }
    "
    >createProject</NButton
  >

  <NInput v-model:value="inputProjectId" :type="'text'" placeholder="ProjectId"></NInput>
  <NButton
    @click="
      async () => {
        if (inputProjectId === '') {
          throw new Error()
        }
        cachedProject = await projectStore.getProject(inputProjectId)
      }
    "
    >getProject</NButton
  >
  <NCollapse>
    <NCollapseItem
      v-for="field in Object.entries(cachedProject === undefined ? new Object() : cachedProject)"
      :key="field[0]?.toString()"
      :title="field[0]"
    >
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
</template>
<script setup lang="ts">
import type { ProjectDTO } from '@/api'
import { useProjectStore } from '@/stores/project'
import { NButton, NInput, NText, NCollapse, NCollapseItem } from 'naive-ui'
import { ref } from 'vue'

const projectStore = useProjectStore()

const inputCalendarId = ref<string>('')
const inputTasklistId = ref<string>('')
const inputProjectId = ref<string>('')
const cachedProject = ref<ProjectDTO>()
const cachedProjectList = ref<ProjectDTO[]>()

const refreshProjectListLoadingStatus = ref<boolean>(false)
</script>
