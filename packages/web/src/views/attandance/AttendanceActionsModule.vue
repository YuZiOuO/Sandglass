<template>
  <NButton
    @click="
      async () => {
        await globalQueryClient.refetchQueries({
          queryKey:['attendance']
        })
      }
    "
  >
    Debug:刷新所有数据
  </NButton>
  <div></div>

  <div>
  <NButton
    type="primary"
    :ghost="['IN', undefined].includes(attendanceStatus)"
    :disabled="['IN', undefined].includes(attendanceStatus)"
    :loading="attendanceRecordIsCreating === 'IN'"
    @click="
      async () => {
        attendanceRecordCreateRef.json.time = new Date()
        attendanceRecordCreateRef.json.type = 'IN'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >{{ attendanceStatus === 'PAUSE' ? '恢复' : '打上班卡' }}</NButton
  >
  <NButton
    type="warning"
    :ghost="attendanceStatus !== 'IN'"
    :disabled="attendanceStatus !== 'IN'"
    :loading="attendanceRecordIsCreating === 'PAUSE'"
    @click="
      async () => {
        attendanceRecordCreateRef.json.time = new Date()
        attendanceRecordCreateRef.json.type = 'PAUSE'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >暂停</NButton
  >
  <NButton
    type="error"
    :ghost="['OUT', undefined].includes(attendanceStatus)"
    :disabled="['OUT', undefined].includes(attendanceStatus)"
    :loading="attendanceRecordIsCreating === 'OUT'"
    @click="
      async () => {
        attendanceRecordCreateRef.json.time = new Date()
        attendanceRecordCreateRef.json.type = 'OUT'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >打下班卡</NButton
  >
  </div>

  <NInput v-model:value="attendanceRecordCreateRef.json.summary" placeholder="事由"></NInput>

  <NInputNumber
    :placeholder="'输入要修改的目标值'"
    v-model:value="attendanceTargetUpdateRef.json.timeMs"
  >
  </NInputNumber>
  <NButton
    @click="
      () => {
        attendanceTargetUpdate.mutate(attendanceTargetUpdateRef)
      }
    "
    >修改目标</NButton
  >
</template>

<script setup lang="ts">
import {
  useAttendaceRecordCreateMutate,
  useAttendaceRecordQuery,
  type AttendanceRecordCreateDTO,
} from '@/services-composable/attendance-record'
import {
  useAttendanceTargetUpdateMutate,
  type AttendanceTargetUpdateDTO,
} from '@/services-composable/attendance-target'
import { computed, ref } from 'vue'
import { NButton } from 'naive-ui'
import { globalQueryClient } from '@/services-composable'

const attendanceRecordLatest = useAttendaceRecordQuery('latest')
const attendanceStatus = computed(() => {
  const data = attendanceRecordLatest.data.value?.at(0)
  return data?.type
})

const attendanceRecordCreate = useAttendaceRecordCreateMutate()
const attendanceRecordCreateRef = ref<AttendanceRecordCreateDTO>({
  json: {
    time: new Date(),
    type: 'IN',
  },
})
const attendanceRecordIsCreating = computed(() => {
  const recordMutateHook = attendanceRecordCreate
  return recordMutateHook.isPending.value ? recordMutateHook.variables.value?.json.type : undefined
})

const attendanceTargetUpdate = useAttendanceTargetUpdateMutate()
const attendanceTargetUpdateRef = ref<AttendanceTargetUpdateDTO>({ json: { timeMs: 0 } })
</script>
