<template>
  <NButton
    @click="async () => attendanceRecordToday.refetch()"
    :loading="attendanceRecordToday.isFetching.value"
    >今日打卡记录</NButton
  >
  <div v-for="r in attendanceRecordToday.data.value" :key="r.time">
    <NSplit />
    您于{{ new Date(r.time).toLocaleString() }} {{ r.type }},事由:{{ r.summary }}
  </div>
</template>

<script setup lang="ts">
import { useAttendaceRecordQuery } from '@/services-composable/attendance-record';

const attendanceRecordToday = useAttendaceRecordQuery('today')
</script>
