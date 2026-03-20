<template>
  <ActionButton
    :loading="targetUpdateHook.isPending.value"
    @positive-click="() => targetUpdateHook.mutate(targetUpdateForm)"
  >
    <template #icon>
      <component :is="attendanceModuleIconMap.TARGET"></component>
    </template>
    <template #description>修改目标</template>
    <template #form>
      <NInputNumber placeholder="新目标值" v-model:value="targetUpdateForm.json.timeMs" />
    </template>
  </ActionButton>
</template>
<script setup lang="ts">
import { NInputNumber } from 'naive-ui'
import {
  useAttendanceTargetUpdateMutate,
  type AttendanceTargetUpdateDTO,
} from '@/services-composable/attendance-target'
import { ref } from 'vue'
import ActionButton from './base/ActionButton.vue'
import { attendanceModuleIconMap } from '../../icon'

const targetUpdateHook = useAttendanceTargetUpdateMutate()
const targetUpdateForm = ref<AttendanceTargetUpdateDTO>({ json: { timeMs: 0 } })
</script>
