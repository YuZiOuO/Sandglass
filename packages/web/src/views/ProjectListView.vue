<template>
  <NCard title="Project List">
    <NSpin :show="projectList.isFetching.value">
      <NMenu v-if="projectListMenuOptions" :options="projectListMenuOptions" />
      <NEmpty v-if="projectList.isSuccess.value && projectListMenuOptions?.length === 0" />
      <ModuleLoadingErrorResult :query-hook="projectList" />
    </NSpin>
  </NCard>

  <NCard>
    {{ projectModel }}
    <NInput v-model:value="projectModel.name" placeholder="name"></NInput>
    <NSelect
      v-model:value="projectModel.calendarId"
      :options="
        calendars.data.value?.items?.map((item) => {
          return {
            label: item.summary,
            key: item.id,
            value: item.id,
          }
        })
      "
      :loading="calendars.isPending.value"
    />
    <NSelect
      v-model:value="projectModel.tasklistId"
      :options="
        tasklists.data.value?.items?.map((item) => {
          return {
            label: item.title,
            key: item.id,
            value: item.id,
          }
        })
      "
      :loading="tasklists.isPending.value"
    />
    <NSelect
      v-model:value="projectModel.repoOwner"
      :options="
        [...new Set(repos.data.value?.map((item) => item.owner.login))].map((owner) => {
          return {
            label: owner,
            key: owner,
            value: owner,
          }
        })
      "
      :loading="repos.isPending.value"
    />
    <NSelect
      v-model:value="projectModel.repoName"
      :options="
        repos.data.value
          ?.filter((item) => item.owner.login === projectModel.repoOwner)
          .map((item) => {
            return {
              key: item.name,
              label: item.name,
              value: item.name,
            }
          })
      "
      :loading="repos.isPending.value"
    />
    <NButton
      @click="async () => projectCreate.mutate(projectModel)"
      :loading="projectCreate.isPending.value"
    >
      提交
    </NButton>
  </NCard>
</template>

<script setup lang="ts">
import { NCard, NInput, NButton, NMenu, NEmpty, type MenuOption, NSpin, NSelect } from 'naive-ui'
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
          { default: () => item.name + ' # ' + item.id },
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
