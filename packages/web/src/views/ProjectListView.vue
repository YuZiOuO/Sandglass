<template>
  <NCard title="Project List">
    <NSpin :show="projectList.isFetching.value">
      <NMenu v-if="projectListMenuOptions" :options="projectListMenuOptions" />
      <NEmpty v-if="projectList.isSuccess.value && projectListMenuOptions?.length === 0" />
      <ModuleLoadingErrorResult :query-hook="projectList" />
    </NSpin>
  </NCard>

  <NCard :title="'创建'">
    <NFlex>
      <!-- preview -->
      {{ projectModel }}

      <!-- name input -->
      <NInput v-model:value="projectModel.name" placeholder="name"></NInput>

      <!-- google bio binding -->
      <NCard :title="'Google'" embedded>
        <template #header-extra>
          <NButton
            @click="
              () => {
                message.loading('正在跳转到Google...')
                authCli.linkSocial({
                  provider: 'google',
                })
              }
            "
            >无数据？点击绑定</NButton
          >
        </template>
        <NFlex>
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
          /> </NFlex
      ></NCard>

      <!-- github bio binding -->
      <NCard :title="'Github'" embedded>
        <template #header-extra>
          <NButton
            @click="
              () => {
                message.loading('正在跳转到Github...')
                authCli.linkSocial({
                  provider: 'github'
                })
              }
            "
            >无数据？点击绑定</NButton
          >
        </template>
        <NFlex>
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
        </NFlex>
      </NCard>
    </NFlex>

    <!-- submit -->
    <template #footer>
      <NButton
        @click="async () => projectCreate.mutate(projectModel)"
        :loading="projectCreate.isPending.value"
      >
        提交
      </NButton>
    </template>
  </NCard>
</template>

<script setup lang="ts">
import {
  NCard,
  NInput,
  NButton,
  NMenu,
  NEmpty,
  type MenuOption,
  NSpin,
  NSelect,
  NFlex,
  useMessage,
} from 'naive-ui'
import {
  useProjectCreateMutation,
  useProjectListQuery,
  type ProjectCreateDTO,
} from '@/services-composable/project'
import { computed, h, ref } from 'vue'
import { useGoogleCalendarListQuery } from '@/services-composable/third-party/google-calendar'
import { useGoogleTaskListsQuery } from '@/services-composable/third-party/google-tasks'
import { useGithubReposOfAuthenticatedUserQuery } from '@/services-composable/third-party/github'
import { RouterLink } from 'vue-router'
import ModuleLoadingErrorResult from '@/common/ModuleLoadingErrorResult.vue'
import { authCli } from '@/services-composable/common'

const projectList = useProjectListQuery()

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

const message = useMessage()
</script>
