<template>
  <n-empty description="你什么也找不到" v-if="!(mergedEvents.length !== 0)" />

  <NTimeline v-else>
    <NTimelineItem
      v-for="r in mergedEvents"
      :key="r.timestamp"
      :type="r.timelineType"
      :content="'to be modified'"
      :time="new Date(r.timestamp).toLocaleString()"
      :line-type="r.lineDashed ? 'dashed' : 'default'"
    >
      <template #header>
        <NDropdown
          v-if="r.dropDownOptions"
          trigger="hover"
          placement="right"
          :options="r.dropDownOptions"
          @select="
            (key) => {
              key
            }
          "
        >
          <NText style="cursor: pointer">
            {{ r.header }}
            <a v-if="r.url" :href="r.url"> </a>
          </NText>
        </NDropdown>
      </template>
      {{ r.content }}
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
  github?: { owner: string; repo: string; since?: Date; until?: Date }
  googleTask?: { TasklistId: string }
  googleCalendar?: { calendarId: string }
}>()

type Event = {
  // basic
  header: string
  timestamp: number
  content?: string
  url?: string

  // styles
  icon: Component
  timelineType: TimelineItemProps['type']
  lineDashed: boolean
  dropDownOptions?: DropdownOption[]
}

const attendanceRecords = useAttendanceRecordQuery(() => props.attendance?.preset)
const commits = useGithubListRepoCommitsQuery(
  () => props.github?.owner,
  () => props.github?.repo,
  () => props.github?.since,
  () => props.github?.until,
)

function commits2Events(c: (typeof commits)['data']['value']): Event[] {
  return (
    c?.map((item) => {
      return {
        timestamp: new Date(item.commit.author?.date ?? 0).getTime(),
        icon: CodeOutline,
        lineDashed: true,
        header: 'Commit',
        content: item.commit.message + ' @' + item.sha.substring(0, 6),
        timelineType: 'info',
      }
    }) ?? []
  )
}

function attendnaceRecord2Events(r: (typeof attendanceRecords)['data']['value']): Event[] {
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

  const dropdownOptions: DropdownOption[] = [
    {
      label: '删除',
      key: '删除',
    },
  ] as const

  return (
    r?.map((item) => {
      return {
        timestamp: new Date(item.time).getTime(),
        icon: attendanceModuleIconMap[item.type],
        lineDashed: !(item.type === 'IN'),
        header: recordType2Name[item.type],
        timelineType: recordType2TimelineType[item.type],
        dropDownOptions: dropdownOptions,
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
</script>
