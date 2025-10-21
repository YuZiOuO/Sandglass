<template>
  <NButton
    @click="
      async () => {
        projectList = (await api.listProject({ headers: { Authorization: 'Bearer ' + token } }))
          .data
      }
    "
  >
    listProject
  </NButton>
  <NText>{{ projectList }}</NText>

  <NInput v-model:value="inputCalendarId" :type="'text'" placeholder="CalendarId"></NInput>
  <NInput v-model:value="inputTasklistId" :type="'text'" placeholder="TasklistId"></NInput>
  <NButton
    @click="
      async () => {
        if (inputCalendarId === '' || inputTasklistId === '') {
          throw new Error()
        }
        await api.createProject(
          {
            uid: (await authenticationStore.getUid()) as string,
            calendarId: inputCalendarId,
            tasklistId: inputTasklistId,
          },
          { headers: { Authorization: 'Bearer ' + token } },
        )
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
        projectDetail = (
          await api.getProject(inputProjectId, { headers: { Authorization: 'Bearer ' + token } })
        ).data
      }
    "
    >getProject</NButton
  >
  <NCollapse>
    <NCollapseItem
      v-for="field in Object.entries(projectDetail as ProjectDTO)"
      :key="field[0]?.toString()"
      :title="field[0]"
    >
      {{ field[1] }}
    </NCollapseItem>
  </NCollapse>
</template>
<script setup lang="ts">
import { ProjectApi, type ProjectDTO } from '@/api'
import { useAuthenticationStore } from '@/stores/authentication'
import { NButton, NInput, NText, NCollapse, NCollapseItem } from 'naive-ui'
import { ref } from 'vue'

const authenticationStore = useAuthenticationStore()

const token = await authenticationStore.getAccessToken()

const api = new ProjectApi()
const projectList = ref<ProjectDTO[]>()

const projectDetail = ref<ProjectDTO>()

const inputCalendarId = ref<string>('')
const inputTasklistId = ref<string>('')

const inputProjectId = ref<string>('')
</script>
