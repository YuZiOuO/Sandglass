<template>
  <NForm>
    <NFlex vertical>
      <NFormItem label="标题">
        <NInput placeholder="Title" v-model:value="inputTitle"></NInput>
      </NFormItem>
      <NFormItem label="截止时间">
        <n-date-picker type="datetime" clearable v-model:value="inputDue" />
      </NFormItem>
      <NFormItem label="备注">
        <NInput placeholder="Title" v-model:value="inputNote"></NInput>
      </NFormItem>
    </NFlex>
  </NForm>
  <div style="display: flex; justify-content: flex-end">
    <n-button
      type="primary"
      @click="
        async () => {
          submitLoading = true
          console.log(
            await addTaskMutation.mutateAsync({
              meta: { tasklistId: props.tasklistId! },
              task: {
                title: inputTitle,
                due: inputDueFormatted,
                notes: inputNote,
              },
            }),
          )
          submitLoading = false
        }
      "
      :loading="submitLoading"
    >
      提交
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { useTaskAddMutation } from '@/services-composable/google-tasks'
import { NFlex, NForm, NFormItem, NInput, NDatePicker, NButton } from 'naive-ui'
import { computed, ref } from 'vue'

const props = defineProps<{ tasklistId: string | undefined }>()

const submitLoading = ref(false)

const inputTitle = ref<string | undefined>()
const inputDue = ref<number | undefined>()
const inputDueFormatted = computed(() =>
  inputDue.value ? new Date(inputDue.value).toISOString() : undefined,
)
const inputNote = ref<string | undefined>()

const addTaskMutation = useTaskAddMutation()
</script>
