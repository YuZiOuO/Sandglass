<template>
  <NPopConfirmWithHook 
  :loading="targetUpdateHook.isPending.value"
  :show="targetUpdateHook.isPending.value"
  @positive-click="() => targetUpdateHook.mutate(targetUpdateForm)">
    <template #icon>
      <component :is="attendanceModuleIconMap.TARGET"></component>
    </template>
    <template #description> 修改目标 </template>
    <template #form>
      <NInputNumber placeholder="新目标值" v-model:value="targetUpdateForm.json.timeMs" />
    </template>
  </NPopConfirmWithHook>
</template>
<script setup lang="ts">
import { NInputNumber } from 'naive-ui'
import { attendanceModuleIconMap } from '../icon'
import {
  useAttendanceTargetUpdateMutate,
  type AttendanceTargetUpdateDTO,
} from '@/services-composable/attendance-target'
import { ref } from 'vue'
import NPopConfirmWithHook from './base/ActionButton.vue'

const targetUpdateHook = useAttendanceTargetUpdateMutate()
const targetUpdateForm = ref<AttendanceTargetUpdateDTO>({ json: { timeMs: 0 } })
</script>
