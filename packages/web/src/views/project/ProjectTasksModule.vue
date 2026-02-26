<script setup lang="ts">
import {
  NCard,
  NCheckbox,
  NCheckboxGroup,
  NEmpty,
  NPopconfirm,
  NInput,
  NButton,
  NFlex,
  NDatePicker,
} from 'naive-ui'
import {
  useGoogleTasksCreateMutation,
  useGoogleTasksPatchMutation,
  useGoogleTasksQuery,
  type googleTask,
} from '@/services-composable/google-tasks'
import { computed, ref } from 'vue'

const props = defineProps<{
  tasklistId?: string
}>()

const tasks = useGoogleTasksQuery(() => props.tasklistId)
const resolvedTasks = computed(() => tasks.data.value)

const taskCreateModel = ref<googleTask>({})
const taskCreate = useGoogleTasksCreateMutation()

const taskPatch = useGoogleTasksPatchMutation()
</script>

<template>
  <n-card size="small" title="Tasks">
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

    <div v-if="tasklistId && resolvedTasks?.items">
      <n-checkbox-group>
        <div v-for="t in resolvedTasks.items" :key="t.id">
          <n-checkbox
            :checked="t.status === 'completed'"
            :label="t.title"
            @update:checked="
              (checked: boolean) => {
                const patchedTask: googleTask = {
                  id: t.id,
                  status: checked ? 'completed' : 'needsAction',
                }
                taskPatch.mutate({ data: patchedTask, tasklistId: tasklistId! })
              }
            "
          />
        </div>
      </n-checkbox-group>
    </div>
    <n-empty v-else> </n-empty>
  </n-card>
</template>
