<template>
  <NPopConfirmWithHook
    :loading="mutateHook.isPending.value"
    @positive-click="() => mutateHook.mutate(mergedForm)"
  >
    <template #description> 补卡 </template>
    <template #icon>
      <component :is="attendanceModuleIconMap.FIX"></component>
    </template>
    <template #form>
      <NFlex>
        {{ mergedForm}}
        <NSelect v-model:value="form.type" :options="selectOptions"> </NSelect>
        <NDatePicker v-model:value="(form.time as number)" :type="'datetime'"></NDatePicker>
      </NFlex>
    </template>
  </NPopConfirmWithHook>
</template>
<script setup lang="ts">
import {
  useAttendanceRecordCreateMutate,
  type AttendanceRecordCreateDTO,
} from '@/services-composable/attendance-record'
import { attendanceModuleIconMap } from '../icon'
import NPopConfirmWithHook from './base/ActionButton.vue'
import { computed, ref } from 'vue'
import { NSelect, NDatePicker, NFlex, type SelectOption } from 'naive-ui'

const props = defineProps<{
  projectId?: string
}>()

const form = ref<AttendanceRecordCreateDTO>({
  time: new Date().getTime(),
  type: 'IN',
})

const mergedForm = computed<AttendanceRecordCreateDTO>(() => ({
  ...form.value,
  projectId: props.projectId,
}))

const mutateHook = useAttendanceRecordCreateMutate()

const selectOptions: SelectOption[] = [
  {
    label: 'IN/PAUSE',
    value: 'IN',
  },
  {
    label: 'OUT',
    value: 'OUT',
  },
]
</script>
