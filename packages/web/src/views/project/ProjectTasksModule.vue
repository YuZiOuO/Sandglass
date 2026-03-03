<script setup lang="ts">
import { NCard, NEmpty, NPopconfirm, NInput, NButton, NFlex, NDatePicker } from 'naive-ui'
import {
  useGoogleTasksCreateMutation,
  useGoogleTasksQuery,
  type googleTask,
} from '@/services-composable/third-party/google-tasks'
import { computed, ref } from 'vue'
import TasksModuleTaskDisplayComponent from './components/TaskDisplayComponent.vue'

const props = defineProps<{
  tasklistId?: string
}>()

const tasks = useGoogleTasksQuery(() => props.tasklistId)
const resolvedTasks = computed(() =>
  [...(tasks.data.value?.items ?? [])].sort((a, b) => a.id!.localeCompare(b.id!)),
  // clone and sorted by id
)

const taskCreateModel = ref<googleTask>({})
const taskCreate = useGoogleTasksCreateMutation()
</script>

<template>
  <n-card title="Tasks" :bordered="false">
    <template #header-extra>
      <n-popconfirm
        @positive-click="
          () => taskCreate.mutate({ tasklistId: props.tasklistId!, data: taskCreateModel })
        "
        :positive-button-props="{ loading: taskCreate.isPending.value }"
        :show="taskCreate.isPending.value || undefined"
      >
        <template #trigger>
          <n-button :size="'tiny'"> + </n-button>
        </template>
        <n-flex>
          新增一个
          <n-input v-model:value="taskCreateModel.title" placeholder="标题"> </n-input>
          <!-- v-model provides a number, and we need string here. -->
          <n-date-picker
            v-model:formatted-value="taskCreateModel.due"
            value-format="yyyy-MM-dd'T00:00:00.000Z'"
            placeholder="截止日期"
          />
          <n-input v-model:value="taskCreateModel.notes" placeholder="备注"> </n-input>
        </n-flex>
      </n-popconfirm>
    </template>

    <div v-if="tasklistId && resolvedTasks">
      <n-flex v-for="t in resolvedTasks" :key="t.id">
        <tasks-module-task-display-component :item="t" :tasklist-id="tasklistId">
        </tasks-module-task-display-component>
      </n-flex>
    </div>
    <n-empty v-else> </n-empty>
  </n-card>
</template>
