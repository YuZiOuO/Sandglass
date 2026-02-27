<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  NButton,
  NCard,
  NEmpty,
  NInput,
  NList,
  NListItem,
  NPopconfirm,
  NPopselect,
  NFlex,
  NSpace,
  NTag,
  NIcon,
  type SelectOption,
} from 'naive-ui'
import {
  useProjectQuery,
  useProjectResourcesQuery,
  useResourcesCreateMutation,
  useResourcesDeleteMutation,
  type ResourcesCreateDTO,
} from '@/services-composable/project'
import { LogoGithub } from '@vicons/ionicons5'
import { IconGoogleCalendar } from '@/assets'

const props = defineProps<{
  projectId: string
}>()

const resources = useProjectResourcesQuery(computed(() => props.projectId).value)

const resourceCreateModel = ref<ResourcesCreateDTO['json']>({
  title: '',
  url: '',
})
const resourceCreate = useResourcesCreateMutation()
const resourceDelete = useResourcesDeleteMutation()

const selectOption: SelectOption[] = [{ label: '删除', value: 'delete' }]

const project = useProjectQuery(() => props.projectId)
</script>

<template>
  <n-card size="small" title="Resources">
    <!-- action -->
    <template #header-extra>
      <n-popconfirm
        @positive-click="
          () =>
            resourceCreate.mutate({
              query: { projectId: projectId },
              json: {
                ...resourceCreateModel,
              },
            })
        "
        :positive-button-props="{ loading: resourceCreate.isPending.value }"
        :show="resourceCreate.isPending.value || undefined"
      >
        <template #trigger>
          <n-button :size="'tiny'"> + </n-button>
        </template>
        <n-flex>
          新增一个
          <n-input v-model:value="resourceCreateModel.title" placeholder="标题"> </n-input>
          <n-input v-model:value="resourceCreateModel.url" placeholder="URL"> </n-input>
        </n-flex>
      </n-popconfirm>
    </template>

    <!-- repo and calendar entry  -->
    <n-space :wrap="false">
      <n-button
        text
        tag="a"
        :href="
          'https://github.com/' + project.data.value?.repoOwner + '/' + project.data.value?.repoName
        "
        target="_blank"
      >
        <n-tag style="cursor: pointer">
          Github
          <template #avatar>
            <n-icon>
              <logo-github />
            </n-icon>
          </template>
        </n-tag>
      </n-button>
      <n-button text tag="a" :href="'TODO'" target="_blank">
        <n-tag style="cursor: pointer">
          Calendar
          <template #avatar>
            <n-icon size="24">
              <icon-google-calendar />
            </n-icon>
          </template>
        </n-tag>
      </n-button>
    </n-space>

    <!-- display -->
    <n-list hoverable map clickable v-if="resources.data.value">
      <n-popselect
        :options="selectOption"
        trigger="click"
        v-for="res in resources.data.value"
        :key="res.id"
        @update:value="
          async () => {
            await resourceDelete.mutateAsync(res.id)
          }
        "
      >
        <n-list-item>
          <a :href="res.url" target="_blank">
            <span v-if="res.url.includes('pdf')">📄</span>
            <span v-else>🔗</span>
            {{ res.title }}
          </a>
        </n-list-item>
      </n-popselect>
    </n-list>

    <!-- empty -->
    <n-empty v-else> </n-empty>
  </n-card>
</template>
