<template>
  <NCard :title="'创建'">
    <NFlex>
      <!-- preview -->
      {{ projectModel }}

      <!-- name input -->
      <NInput v-model:value="projectModel.name" placeholder="name"></NInput>

      <!-- google bio binding -->
      <NGrid cols="1 m:2" responsive="screen" :x-gap="12" :y-gap="12">
        <NGi>
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
              >
                无数据？点击绑定
              </NButton>
            </template>
            <NFlex>

              <!-- google calendar -->
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
              >
                <template #arrow><IconGoogleCalendarOutline /></template>
                <template #action>
                  <NFlex :wrap="false">
                    <NInput v-model:value="calendarModel.summary" :placeholder="'日历名称'" />
                    <NButton
                      @click="
                        () => {
                          calendarCreate.mutate({
                            data: calendarModel,
                          })
                        }
                      "
                      :loading="calendarCreate.isPending.value"
                    >
                      创建
                    </NButton>
                  </NFlex>
                </template>
              </NSelect>

              <!-- google tasks -->
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
              >
                <template #arrow><IconGoogleTasksOutline /></template>
                <template #action>
                  <NFlex :wrap="false">
                    <NInput v-model:value="tasklistModel.title" :placeholder="'任务列表名称'" />
                    <NButton
                      @click="
                        () => {
                          tasklistCreate.mutate({
                            data: tasklistModel,
                          })
                        }
                      "
                      :loading="tasklistCreate.isPending.value"
                    >
                      创建
                    </NButton>
                  </NFlex>
                </template>
              </NSelect>
            </NFlex>
          </NCard>
        </NGi>

        <!-- github bio binding -->
        <NGi>
          <NCard :title="'Github'" embedded>
            <template #header-extra>
              <NButton
                @click="
                  () => {
                    message.loading('正在跳转到Github...')
                    authCli.linkSocial({
                      provider: 'github',
                    })
                  }
                "
              >
                无数据？点击绑定
              </NButton>
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
              >
                <template #arrow><PersonOutline /></template>
              </NSelect>
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
              >
                <template #arrow><LogoGithub /></template>
              </NSelect>
            </NFlex>
          </NCard>
        </NGi>
      </NGrid>
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
import { NCard, NInput, NButton, NSelect, NFlex, useMessage, NGrid, NGi } from 'naive-ui'
import { useProjectCreateMutation, type ProjectCreateDTO } from '@/services-composable/project'
import { ref } from 'vue'
import {
  type googleCalendar,
  useGoogleCalendarCreateMutation,
  useGoogleCalendarListQuery,
} from '@/services-composable/third-party/google-calendar'
import {
  type googleTasklist,
  useGoogleTaskListsCreateMutation,
  useGoogleTaskListsQuery,
} from '@/services-composable/third-party/google-tasks'
import { useGithubReposOfAuthenticatedUserQuery } from '@/services-composable/third-party/github'
import { authCli } from '@/services-composable/common'
import { LogoGithub, PersonOutline } from '@vicons/ionicons5'
import { IconGoogleCalendarOutline, IconGoogleTasksOutline } from '@/assets'

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

const calendarModel = ref<googleCalendar>({})
const calendarCreate = useGoogleCalendarCreateMutation()

const tasklistModel = ref<googleTasklist>({})
const tasklistCreate = useGoogleTaskListsCreateMutation()

const message = useMessage()
</script>
