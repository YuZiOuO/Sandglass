<template>
  <NButton
    type="primary"
    :disabled="attendanceStatus !== 'OUT'"
    :loading="attendanceRecordIsCreating === 'IN'"
    @click="
      async () => {
        attendanceRecordCreateRef.json.type = 'IN'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >打上班卡</NButton
  >
  <NButton
    type="primary"
    :disabled="attendanceStatus !== 'IN'"
    :loading="attendanceRecordIsCreating === 'PAUSE'"
    @click="
      async () => {
        attendanceRecordCreateRef.json.type = 'PAUSE'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >暂停</NButton
  >
  <NButton
    :disabled="attendanceStatus !== 'IN'"
    :loading="attendanceRecordIsCreating === 'OUT'"
    @click="
      async () => {
        attendanceRecordCreateRef.json.type = 'OUT'
        attendanceRecordCreate.mutate(attendanceRecordCreateRef)
      }
    "
    >打下班卡</NButton
  >
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
  return recordMutateHook.isPending ? recordMutateHook.variables.value?.json.type : undefined
})

const attendanceTargetUpdate = useAttendanceTargetUpdateMutate()
const attendanceTargetUpdateRef = ref<AttendanceTargetUpdateDTO>({ json: { timeMs: 0 } })
</script>
