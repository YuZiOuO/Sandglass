<template>
  <NCard title="Project List">
    <NSpin :show="projectList.isFetching.value">
      <NMenu v-if="projectListMenuOptions" :options="projectListMenuOptions" />
      <NEmpty v-if="projectList.isSuccess.value && !projectListMenuOptions" />
      <ModuleLoadingErrorResult :query-hook="projectList" />
    </NSpin>
  </NCard>

  <NCard>
    <NInput v-model:value="projectModel.name" placeholder="name"></NInput>
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
import { NCard, NInput, NButton, NMenu, NEmpty, type MenuOption, NSpin } from 'naive-ui'
import {
  useProjectCreateMutation,
  useProjectsQuery,
  type ProjectCreateDTO,
} from '@/services-composable/project'
import { computed, h, ref } from 'vue'
import { useGoogleCalendarListQuery } from '@/services-composable/google-calendar'
import { useGoogleTaskListsQuery } from '@/services-composable/google-tasks'
import { useGithubReposOfAuthenticatedUserQuery } from '@/services-composable/github'
import { RouterLink } from 'vue-router'
import ModuleLoadingErrorResult from '@/common/ModuleLoadingErrorResult.vue'

const projectList = useProjectsQuery()

const projectListMenuOptions = computed<MenuOption[] | undefined>(() => {
  return projectList.data.value?.map((item) => {
    return {
      label: () =>
        h(
          RouterLink,
          { to: { name: 'Project', params: { id: item.id } } },
          { default: () => item.id },
        ),
      key: item.id,
    }
  })
})

const projectModel = ref<ProjectCreateDTO>({
  calendarId: '',
  tasklistId: '',
  repoOwner: '',
  repoName: '',
  name: '',
})
const projectCreate = useProjectCreateMutation()

const calendars = useGoogleCalendarListQuery()
const tasklists = useGoogleTaskListsQuery()
const repos = useGithubReposOfAuthenticatedUserQuery()
</script>
