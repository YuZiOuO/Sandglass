<template>
  <NForm>
    <NFlex vertical>
      <NFormItem label="标题">
        <NInput placeholder="Title" v-model:value="formModel.title"></NInput>
      </NFormItem>
      <NFormItem label="截止时间">
        <!-- This date picker bind timestamp input to string field in formModel -->
        <n-date-picker
          type="datetime"
          clearable
          :value="formModel.due ? new Date(formModel.due).getTime() : undefined"
          v-on:update:value="
            (value: number) => {
              formModel.due = new Date(value).toISOString()
            }
          "
        />
      </NFormItem>
      <NFormItem label="备注">
        <NInput placeholder="Notes" v-model:value="formModel.notes"></NInput>
      </NFormItem>
    </NFlex>
  </NForm>
  <div style="display: flex; justify-content: flex-end">
    <n-button
      type="primary"
      @click="
        async () => {
          submitLoading = true
          if (!props.initialData) {
            await addTaskMutation.mutateAsync({
              meta: { tasklistId: props.tasklistId! },
              task: formModel,
            })
          } else {
            await patchTaskMutation.mutateAsync({
              meta: { tasklistId: props.tasklistId!, taskId: props.initialData.id! },
              task: formModel,
            })
          }
          submitLoading = false
          $emit('submit')
        }
      "
      :loading="submitLoading"
    >
      提交
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useTaskAddMutation, useTaskPatchMutation } from '@/services-composable/google-tasks'
import { NFlex, NForm, NFormItem, NInput, NDatePicker, NButton } from 'naive-ui'
import { ref } from 'vue'

defineEmits(['submit'])

const props = defineProps<{
  tasklistId: string | undefined
  initialData?: gapi.client.tasks.Task
}>()

const formModel = ref<gapi.client.tasks.Task>({ ...props.initialData })

const submitLoading = ref(false)

const addTaskMutation = useTaskAddMutation()
const patchTaskMutation = useTaskPatchMutation()
</script>
