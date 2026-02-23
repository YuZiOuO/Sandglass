<template>
  <NDatePicker
    v-model:formatted-value="leaveRecordCreateRef.json.date as FormattedValue"
    value-format="yyyy-MM-dd"
    type="date"
  />
  <NInputNumber :placeholder="'小时数'" v-model:value="leaveRecordCreateRef.json.timeMs" />
  <NButton
    @click="
      () => {
        leaveRecordCreateRef.json.timeMs *= 3600 * 1000
        leaveRecordCreate.mutate(leaveRecordCreateRef)
      }
    "
    >请假</NButton
  >
</template>

<script setup lang="ts">
import { useLeaveRecordCreateMutate, type LeaveRecordCreateDTO } from '@/services-composable/attendance-target';
import { NButton,NDatePicker,NInputNumber } from 'naive-ui';
import type { FormattedValue } from 'naive-ui/es/date-picker/src/interface';
import { ref } from 'vue';

const leaveRecordCreate = useLeaveRecordCreateMutate()
const leaveRecordCreateRef = ref<LeaveRecordCreateDTO>({
  json: { date: null, timeMs: 0 },
})

</script>