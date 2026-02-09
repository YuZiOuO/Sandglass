<template>
  <NSpace vertical size="large">
    <!-- Main Button Area -->
    <NSpace :wrap="false" justify="center" size="large">
      <NButton
        size="large"
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
        size="large"
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
      <NPopconfirm
        @positive-click="
          async () => {
            attendanceRecordCreateRef.json.time = new Date()
            attendanceRecordCreateRef.json.type = 'OUT'
            attendanceRecordCreate.mutate(attendanceRecordCreateRef)
          }
        "
      >
        <template #trigger>
          <NButton
            size="large"
            type="error"
            :ghost="['OUT', undefined].includes(attendanceStatus)"
            :disabled="['OUT', undefined].includes(attendanceStatus)"
            :loading="attendanceRecordIsCreating === 'OUT'"
            >打下班卡</NButton
          >
        </template>
        您将签出。当前时间:{{ useNow() }}
      </NPopconfirm>
    </NSpace>

    <!-- Sub Button Area -->
    <NFlex :align="'center'" :wrap="false">
      <NInput placeholder="事由(选填)" style="flex: 1"> </NInput>
      <NSpace size="small" :wrap="false">
        <NButton circle> 补卡 </NButton>
        <NButton circle> 请假 </NButton>
        <NButton
          circle
          @click="
            () => {
              attendanceTargetUpdate.mutate(attendanceTargetUpdateRef)
            }
          "
          >修改目标</NButton
        >
      </NSpace>
    </NFlex>
  </NSpace>
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
import { NButton, NInput, NPopconfirm, NSpace, NFlex } from 'naive-ui'
import { useNow } from '@vueuse/core'

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

<style scoped></style>
