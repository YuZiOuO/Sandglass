<template>
  <n-empty description="你什么也找不到" v-if="!(filteredMergedEvents.length !== 0)" />

  <NTimeline v-else>
    <NTimelineItem
      v-for="r in filteredMergedEvents"
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
          @select="r.dropDownCallback"
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
  useAttendanceRecordDeleteMutate,
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
import { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import { GitCommitOutline, GitMergeOutline } from '@vicons/ionicons5'

/**
 * if undefined, events of that type will not be displayed
 */
export type EventsTimelineDisplayPreset = 'today' | 'withIn7days' | 'withIn30days'
const props = defineProps<{
  attendance?: { preset: AttendanceRecordQueryType; projectId?: string }
  github?: { owner: string; repo: string; since?: Date; until?: Date }
  googleTask?: { TasklistId: string }
  googleCalendar?: { calendarId: string }
  displayPreset?: EventsTimelineDisplayPreset
}>()

const presetStartTimestamp = computed(() => {
  let relativeDate: Date | undefined = new Date()
  switch (props.displayPreset) {
    case 'today':
      relativeDate.setHours(0, 0, 0, 0)
      break
    case 'withIn7days':
      relativeDate.setDate(relativeDate.getDate() - 7)
      break
    case 'withIn30days':
      relativeDate.setDate(relativeDate.getDate() - 30)
      break
    default:
      relativeDate = undefined
  }
  return relativeDate?.getTime()
})

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
  dropDownCallback?: (key: string, options: DropdownOption) => void
}

const attendanceRecords = useAttendanceRecordQuery(
  () => props.attendance?.preset,
  () => props.attendance?.projectId,
)
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
        icon: item.parents.length > 1 ? GitMergeOutline : GitCommitOutline,
        lineDashed: false,
        header: 'Commit',
        content: item.commit.message + ' @' + item.sha.substring(0, 6),
        timelineType: 'info',
      }
    }) ?? []
  )
}

const attendanceRecordDelete = useAttendanceRecordDeleteMutate()
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
      key: 'delete',
    },
  ] as const

  return (
    r
      ?.filter((item) => {
        const projectId = props.attendance?.projectId
        if (!projectId) {
          return true
        } else {
          return item.projectId === projectId
        }
      }) // filter those not in specified project
      .map((item) => {
        return {
          timestamp: new Date(item.time).getTime(),
          icon: attendanceModuleIconMap[item.type],
          lineDashed: !(item.type === 'IN'),
          header: recordType2Name[item.type] + ' @ ' + item.projectId,
          timelineType: recordType2TimelineType[item.type],
          dropDownOptions: dropdownOptions,
          dropDownCallback: () => {
            attendanceRecordDelete.mutate(item.id)
          },
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

const filteredMergedEvents = computed(() =>
  mergedEvents.value.filter(
    (item) => !presetStartTimestamp.value || item.timestamp > presetStartTimestamp.value,
  ),
)
</script>
