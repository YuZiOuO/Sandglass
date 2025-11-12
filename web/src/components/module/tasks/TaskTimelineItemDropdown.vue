<template>
  <NDropdown trigger="hover" :options="taskOptions">
    <NButton size="tiny" :bordered="false" disabled>...</NButton>
  </NDropdown>
</template>
<script setup lang="ts">
import { useTaskDeleteMutation, useTaskPatchMutation } from '@/services-composable/google-tasks'
import type { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { NDropdown, NButton } from 'naive-ui'

const props = defineProps<{ tasklistId: string; task: gapi.client.tasks.Task }>()

const taskPatchMutation = useTaskPatchMutation()
const taskDeleteMutation = useTaskDeleteMutation()

const emit = defineEmits<{
  edit: [taskId: string]
}>()

const taskOptions: DropdownMixedOption[] = [
  {
    label: '标记为未完成',
    key: '_mark as undone',
    disabled: props.task.completed === 'false',
    props: {
      onClick: async () => {
        await taskPatchMutation.mutateAsync({
          meta: { tasklistId: props.tasklistId, taskId: props.task.id! },
          task: { completed: 'true' },
        })
      },
    },
  },
  {
    label: '编辑',
    key: '_edit',
    props: {
      onClick: async () => {
        emit('edit', props.task.id!)
      },
    },
  },
  {
    label: '附件管理',
    key: '_attachment',
  },
  { type: 'divider', key: '分割线' },
  {
    label: '删除',
    key: '_delete',
    props: {
      onClick: async () => {
        await taskDeleteMutation.mutateAsync({
          meta: { tasklistId: props.tasklistId, taskId: props.task.id! },
        })
      },
    },
  },
]
</script>
