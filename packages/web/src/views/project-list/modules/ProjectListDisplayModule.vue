<template>
  <NCard title="Project List">
    <NSpin :show="projectList.isFetching.value">
      <NList hoverable clickable>
        <NListItem
          v-for="item in projectList.data?.value || []"
          :key="item.id"
          @click="router.push({ name: 'Project', params: { id: item.id } })"
        >
          <NThing :title="item.name || '未命名项目'">
            <template #description>
              <NSpace size="small">
                <NTag
                  :type="item.repoOwner && item.repoName ? 'info' : 'default'"
                  size="small"
                  :bordered="false"
                >
                  <template #icon>
                    <NIcon><LogoGithub /></NIcon>
                  </template>
                  {{ item.repoOwner && item.repoName ? `${item.repoOwner}/${item.repoName}` : '未绑定 Repo' }}
                </NTag>
                <NTag
                  :type="item.calendarId ? 'success' : 'default'"
                  size="small"
                  :bordered="false"
                >
                  <template #icon>
                    <NIcon><IconGoogleCalendarOutline /></NIcon>
                  </template>
                  {{ item.calendarId ? '已绑定 Calendar' : '未绑定 Calendar' }}
                </NTag>
                <NTag
                  :type="item.tasklistId ? 'warning' : 'default'"
                  size="small"
                  :bordered="false"
                >
                  <template #icon>
                    <NIcon><IconGoogleTasksOutline /></NIcon>
                  </template>
                  {{ item.tasklistId ? '已绑定 Tasks' : '未绑定 Tasks' }}
                </NTag>
              </NSpace>
            </template>
          </NThing>
        </NListItem>
      </NList>

      <NEmpty
        v-if="projectList.isSuccess.value && (projectList.data.value?.length === 0 || !projectList.data.value)"
      />
      <ModuleLoadingErrorResult :query-hook="projectList" />
    </NSpin>
  </NCard>
</template>

<script setup lang="ts">
import { NSpin, NEmpty, NCard, NList, NListItem, NThing, NSpace, NTag, NIcon } from 'naive-ui'
import ModuleLoadingErrorResult from '@/views/common/ModuleLoadingErrorResult.vue'
import { useProjectListQuery } from '@/services-composable/project'
import { useRouter } from 'vue-router'
import { LogoGithub } from '@vicons/ionicons5'
import { IconGoogleCalendarOutline, IconGoogleTasksOutline } from '@/assets'

const projectList = useProjectListQuery()
const router = useRouter()
</script>
