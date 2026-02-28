<template>
  <MainActionButton
    :disabled="cannotCheckIn"
    :loading="recordCreateHook."
    @click="
      () =>
        recordCreateHook.mutate({
          time: new Date(),
          type: 'IN',
          projectId: projectId,
        })
    "
  >
    {{ displayResume ? '恢复' : '打上班卡' }}
  </MainActionButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MainActionButton from './base/MainActionButton.vue'
import {
  useAttendanceLatestStatus,
  useAttendanceRecordCreateMutate,
} from '@/services-composable/attendance-record'

defineProps<{ projectId: string }>()

const attendanceStatus = useAttendanceLatestStatus()
const cannotCheckIn = computed(() => ['IN', undefined].includes(attendanceStatus.data.value))
const displayResume = computed(() => attendanceStatus.data.value === 'PAUSE')

const recordCreateHook = useAttendanceRecordCreateMutate()
</script>
