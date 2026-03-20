<script setup lang="ts">
import {
  NCard,
  NEmpty,
  NPopconfirm,
  NInput,
  NButton,
  NFlex,
  NDatePicker,
  NIcon,
  NButtonGroup,
  NSpin,
} from 'naive-ui'
import {
  useGoogleTasksCreateMutation,
  useGoogleTasksQuery,
  type googleTask,
} from '@/services-composable/third-party/google-tasks'
import { computed, ref } from 'vue'
import TasksModuleTaskDisplayComponent from '../components/TaskDisplayComponent.vue'
import { AddOutline, RefreshOutline } from '@vicons/ionicons5'

const props = defineProps<{
  tasklistId?: string
}>()

const tasks = useGoogleTasksQuery(() => props.tasklistId)
const resolvedTasks = computed(
  () => [...(tasks.data.value?.items ?? [])].sort((a, b) => a.id!.localeCompare(b.id!)),
  // clone and sorted by id
)

const taskCreateModel = ref<googleTask>({})
const taskCreate = useGoogleTasksCreateMutation()
</script>

<template>
  <n-card title="Tasks" :bordered="false">
    <template #header-extra>
      <n-button-group :size="'tiny'">
        <n-popconfirm
          @positive-click="
            () => taskCreate.mutate({ tasklistId: props.tasklistId!, data: taskCreateModel })
          "
          :positive-button-props="{ loading: taskCreate.isPending.value }"
          :show="taskCreate.isPending.value || undefined"
        >
          <template #trigger>
            <NButton>
              <template #icon>
                <n-icon>
                  <add-outline />
                </n-icon>
              </template>
            </NButton>
          </template>
          <n-flex>
            新增一个
            <n-input v-model:value="taskCreateModel.title" placeholder="标题"></n-input>
            <!-- v-model provides a number, and we need string here. -->
            <n-date-picker
              v-model:formatted-value="taskCreateModel.due"
              value-format="yyyy-MM-dd'T00:00:00.000Z'"
              placeholder="截止日期"
            />
            <n-input v-model:value="taskCreateModel.notes" placeholder="备注"></n-input>
          </n-flex>
        </n-popconfirm>
        <NButton
          :focusable="false"
          :loading="tasks.isFetching.value"
          @click="() => tasks.refetch()"
        >
          <template #icon>
            <n-icon>
              <refresh-outline></refresh-outline>
            </n-icon>
          </template>
        </NButton>
      </n-button-group>
    </template>

    <div v-if="tasklistId && resolvedTasks">
      <n-flex>
        <tasks-module-task-display-component
          v-for="t in resolvedTasks"
          :key="t.id"
          :item="t"
          :tasklist-id="tasklistId"
        />
      </n-flex>
    </div>
    <div v-else>
      <n-spin v-if="tasks.isPending.value" />
      <n-empty v-else />
    </div>
  </n-card>
</template>
