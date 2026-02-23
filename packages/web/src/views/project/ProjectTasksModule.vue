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
  useGoogleTasksQuery,
  type googleTasksCreateDTO,
} from '@/services-composable/google-tasks'
import { computed, ref } from 'vue'

const props = defineProps<{
  tasklistId?: string
}>()

const tasks = useGoogleTasksQuery(() => props.tasklistId)
const resolvedTasks = computed(() => tasks.data.value)

const taskCreateModel = ref<googleTasksCreateDTO>({})
const taskCreate = useGoogleTasksCreateMutation()
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

    <div v-if="resolvedTasks?.items">
      <n-checkbox-group class="flex flex-col gap-2">
        <div v-for="t in resolvedTasks.items" :key="t.id">
          <n-checkbox :checked="t.status === 'completed'" :label="t.title" />
        </div>
      </n-checkbox-group>
    </div>
    <n-empty v-else> </n-empty>
  </n-card>
</template>
