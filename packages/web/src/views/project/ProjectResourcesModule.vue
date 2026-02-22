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
  type SelectOption,
} from 'naive-ui'
import {
  useProjectResourcesQuery,
  useResourcesCreateMutation,
  useResourcesDeleteMutation,
  type ResourcesCreateDTO,
} from '@/services-composable/project'

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
