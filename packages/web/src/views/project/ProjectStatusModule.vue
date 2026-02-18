<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NPopconfirm, NButton, useMessage } from 'naive-ui'
import { useAttendanceLatestStatus, useAttendanceRecordCreateMutate } from '@/services-composable/attendance-record'

const message = useMessage()
const { data: attendanceStatus, refetch: refetchStatus } = useAttendanceLatestStatus()
const { mutate: mutateAttendance } = useAttendanceRecordCreateMutate()

// Status Logic
const isWorking = computed(() => (attendanceStatus.value as unknown as string) === 'IN')

const handlePunch = () => {
  const type = isWorking.value ? 'OUT' : 'IN'
  mutateAttendance({ json: { type: type as 'IN' | 'OUT' } }, {
    onSuccess: () => {
      message.success(type === 'IN' ? '开始专注' : '打卡结束')
      refetchStatus()
    }
  })
}
</script>

<template>
  <n-card size="small" class="bg-gray-50 dark:bg-gray-800">
     <div class="flex flex-col items-center justify-center p-4 gap-4">
       <div class="text-lg font-bold">
         {{ isWorking ? '🔥 正在沉淀' : '💤 等待开始' }}
       </div>
       <n-popconfirm v-if="isWorking" @positive-click="handlePunch">
         <template #trigger>
           <n-button type="error" size="large" circle class="h-24 w-24 text-2xl shadow-lg">
             ⏹️
           </n-button>
         </template>
         确认结束本次沉淀？
       </n-popconfirm>
       <n-button v-else type="primary" size="large" circle class="h-24 w-24 text-2xl shadow-lg" @click="handlePunch">
         ⏱️
       </n-button>
       <span class="text-xs text-gray-500">点击打卡</span>
     </div>
  </n-card>
</template>
