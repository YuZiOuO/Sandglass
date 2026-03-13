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
        <div v-else>
          <NText style="cursor: pointer">
            {{ r.header }}
            <a v-if="r.url" :href="r.url"> </a>
          </NText>
        </div>
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
} from '@/services-composable/attendance-record'
import { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import { NTimeline, NTimelineItem, NEmpty, NDropdown, NText, NIcon } from 'naive-ui'
import { computed } from 'vue'
import { attendanceRecord2Events, commits2Events, tasks2Events } from './EventsTimeline'
import { useGoogleTasksQuery } from '@/services-composable/third-party/google-tasks'

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
const tasks = useGoogleTasksQuery(() => props.googleTask?.TasklistId, true)

const attendanceEvents = computed(() => attendanceRecord2Events(attendanceRecords.data.value))
const commitsEvents = computed(() => commits2Events(commits.data.value))
const tasksEvents = computed(() => tasks2Events(tasks.data.value?.items))

const mergedEvents = computed(() => {
  const merged = [...attendanceEvents.value, ...commitsEvents.value, ...tasksEvents.value]
  return merged.sort((a, b) => a.timestamp - b.timestamp)
})

const filteredMergedEvents = computed(() =>
  mergedEvents.value.filter(
    (item) => !presetStartTimestamp.value || item.timestamp > presetStartTimestamp.value,
  ),
)
</script>
