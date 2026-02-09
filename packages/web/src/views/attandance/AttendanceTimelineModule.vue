<template>
  <n-empty description="你什么也找不到" v-if="attendanceRecordToday.data.value?.length === 0">
  </n-empty>

  <NTimeline v-else>
    <NTimelineItem
      v-for="r in attendanceRecordToday.data.value"
      :key="r.id"
      :type="recordType2TimelineType[r.type]"
      :content="r.summary ?? undefined"
      :time="r.time"
    >
      <template #header>
        <NDropdown
          trigger="hover"
          placement="right"
          :options="dropdownOption"
          @select="(key) => {key}"
        >
          <NText style="cursor: pointer">
            {{ recordType2Name[r.type] }}
          </NText>
        </NDropdown>
      </template>
    </NTimelineItem>
  </NTimeline>
</template>

<script setup lang="ts">
import {
  useAttendaceRecordQuery,
  type AttendanceRecordType,
} from '@/services-composable/attendance-record'
import {
  NTimeline,
  NTimelineItem,
  NEmpty,
  type TimelineItemProps,
  NDropdown,
  type DropdownOption,
  NText,
} from 'naive-ui'

const attendanceRecordToday = useAttendaceRecordQuery('today')

const recordType2TimelineType: Record<AttendanceRecordType, TimelineItemProps['type']> = {
  IN: 'success',
  OUT: 'error',
  PAUSE: 'warning',
} as const

const recordType2Name: Record<AttendanceRecordType, string> = {
  IN: '签到',
  OUT: '签退',
  PAUSE: '暂停',
} as const

const dropdownOption: DropdownOption[] = [
  {
    label: '删除',
    key: '删除',
  },
]
</script>
