<template>
  <NCard title="Project List">
    {{ projectList.data.value }}
  </NCard>

  <NCard>
    <NInput v-model:value="projectModel.calendarId" placeholder="calendarId"></NInput>
    <NInput v-model:value="projectModel.tasklistId" placeholder="tasklistId"></NInput>
    <NInput v-model:value="projectModel.repoOwner" placeholder="repoOwner"></NInput>
    <NInput v-model:value="projectModel.repoName" placeholder="repoName"></NInput>
    <NButton
      @click="async () => projectCreate.mutate(projectModel)"
      :loading="projectCreate.isPending.value"
    >
      提交
    </NButton>
  </NCard>

  <NCard title="calendars">
    <NButton @click="() => calendars.refetch" :loading="calendars.isFetching.value">
      refresh
    </NButton>
    {{ calendars.data.value }}
  </NCard>

  <NCard title="tasklists">
    <NButton @click="() => tasklists.refetch" :loading="tasklists.isFetching.value">
      refresh
    </NButton>
    {{ tasklists.data.value }}
  </NCard>

  <NCard title="repos">
    <NButton @click="() => repos.refetch" :loading="repos.isFetched.value"> refresh </NButton>
    {{ repos.data.value }}
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NInput, NButton } from 'naive-ui'
import {
  useProjectCreateMutation,
  useProjectsQuery,
  type ProjectCreateDTO,
} from '@/services-composable/project'
import { ref } from 'vue'
import { useGoogleCalendarListQuery } from '@/services-composable/google-calendar'
import { useGoogleTaskListsQuery } from '@/services-composable/google-tasks'
import { useGithubReposOfAuthenticatedUserQuery } from '@/services-composable/github'

const projectList = useProjectsQuery()

const projectModel = ref<ProjectCreateDTO>({
  calendarId: '',
  tasklistId: '',
  repoOwner: '',
  repoName: '',
})
const projectCreate = useProjectCreateMutation()

const calendars = useGoogleCalendarListQuery()
const tasklists = useGoogleTaskListsQuery()
const repos = useGithubReposOfAuthenticatedUserQuery()
</script>
