<template>
  <NPopConfirmWithHook
    :loading="mutateHook.isPending.value"
    @positive-click="() => mutateHook.mutate(form)"
  >
    <template #description> 请假 </template>
    <template #icon>
      <component :is="attendanceModuleIconMap.LEAVE"></component>
    </template>
    <template #form>
      <NDatePicker type="date" v-model:value="form.date as number" />
      <NInputNumber v-model:value="form.timeMs" />
    </template>
  </NPopConfirmWithHook>
</template>
<script setup lang="ts">
import { NDatePicker, NInputNumber } from 'naive-ui'
import { attendanceModuleIconMap } from '../icon'
import NPopConfirmWithHook from './base/ActionButton.vue'
import { ref } from 'vue'
import {
  useLeaveRecordCreateMutate,
  type LeaveRecordCreateDTO,
} from '@/services-composable/attendance-target'

const form = ref<LeaveRecordCreateDTO>({
  date: new Date().getTime(),
  timeMs: 0,
})

const mutateHook = useLeaveRecordCreateMutate()
</script>
