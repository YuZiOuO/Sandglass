<template>
  <n-empty description="你什么也找不到" v-if="attendanceRecords.data.value?.length === 0">
  </n-empty>

  <NTimeline v-else>
    <NTimelineItem
      v-for="r in mergedEvents"
      :key="r.timestamp"
      :type="r.timelineType"
      :content="'to be modified'"
      :time="r.timestamp"
      :line-type="r.lineDashed ? 'dashed' : 'default'"
    >
      <template #header>
        <NDropdown
          trigger="hover"
          placement="right"
          :options="dropdownOption"
          @select="
            (key) => {
              key
            }
          "
        >
          <NText style="cursor: pointer">
            {{ r.name }}
          </NText>
        </NDropdown>
      </template>
      <template #icon>
        <NIcon size="large">
          <component :is="r.icon" />
        </NIcon>
      </template>
    </NTimelineItem>
  </NTimeline>
</template>

<script setup lang="ts">
import {
  useAttendanceRecordQuery,
  type AttendanceRecordQueryType,
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
  NIcon,
} from 'naive-ui'
import { attendanceModuleIconMap } from '../attendance/icon'
import { computed, type Component } from 'vue'
import { useGithubListRepoCommitsQuery } from '@/services-composable/github'
import { CodeOutline } from '@vicons/ionicons5'

/**
 * if undefined, events of that type will not be displayed
 */
const props = defineProps<{
  attendance?: { preset: AttendanceRecordQueryType }
  github?: { owner: string; repo: string }
  googleTask?: { TasklistId: string }
  googleCalendar?: { calendarId: string }
}>()

enum EventType {
  ATTENDANCE_IN,
  ATTENDANCE_OUT,
  ATTENDANCE_PAUSE,
  GITHUB_COMMIT,
}

type Event = {
  name: string // to be rendered
  type: EventType
  timestamp: number
  icon: Component
  timelineType: TimelineItemProps['type']
  lineDashed: boolean
}

const attendanceRecords = useAttendanceRecordQuery(() => props.attendance?.preset)
const commits = useGithubListRepoCommitsQuery(
  () => props.github?.owner,
  () => props.github?.repo,
)

function commits2Events(c: (typeof commits)['data']['value']): Event[] {
  return (
    c?.map((item) => {
      return {
        type: EventType.GITHUB_COMMIT,
        timestamp: new Date(item.commit.author?.date ?? 0).getTime(),
        icon: CodeOutline,
        lineDashed: true,
        name: 'Github commit @' + item.sha,
        timelineType: 'info',
      }
    }) ?? []
  )
}

function attendnaceRecord2Events(r: (typeof attendanceRecords)['data']['value']): Event[] {
  const recordType2EventType: Record<AttendanceRecordType, EventType> = {
    IN: EventType.ATTENDANCE_IN,
    OUT: EventType.ATTENDANCE_OUT,
    PAUSE: EventType.ATTENDANCE_PAUSE,
  } as const

  const recordType2Name: Record<AttendanceRecordType, string> = {
    IN: '签到',
    OUT: '签退',
    PAUSE: '暂停',
  } as const

  const recordType2TimelineType: Record<AttendanceRecordType, TimelineItemProps['type']> = {
    IN: 'success',
    OUT: 'error',
    PAUSE: 'warning',
  } as const

  return (
    r?.map((item) => {
      return {
        timestamp: new Date(item.time).getTime(),
        type: recordType2EventType[item.type],
        icon: attendanceModuleIconMap[item.type],
        lineDashed: !(item.type === 'IN'),
        name: recordType2Name[item.type],
        timelineType: recordType2TimelineType[item.type],
      }
    }) ?? []
  )
}

const attendanceEvents = computed(() => attendnaceRecord2Events(attendanceRecords.data.value))
const commitsEvents = computed(() => commits2Events(commits.data.value))

const mergedEvents = computed(() => {
  const merged = [...attendanceEvents.value, ...commitsEvents.value]
  return merged.sort((a, b) => a.timestamp - b.timestamp)
})

const dropdownOption: DropdownOption[] = [
  {
    label: '删除',
    key: '删除',
  },
]
</script>
