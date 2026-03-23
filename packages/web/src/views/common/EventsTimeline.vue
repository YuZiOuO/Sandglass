<template>
  <n-empty description="你什么也找不到" v-if="!(filteredMergedEvents.length !== 0)" />

  <NTimeline v-else>
    <NTimelineItem v-if="loading">
      <n-spin size="small" />
    </NTimelineItem>
    <NTimelineItem
      v-for="r in filteredMergedEvents"
      :key="r.timestamp"
      :type="r.timelineType"
      :content="'to be modified'"
      :time="new Date(r.timestamp).toLocaleString()"
      :line-type="r.lineDashed ? 'dashed' : 'default'"
    >
      <template #header>
        <component
          :is="r.actions?.length ? NDropdown : 'div'"
          v-bind="
            r.actions?.length
              ? {
                  trigger: 'hover',
                  placement: 'right',
                  options: r.actions,
                  onSelect: (key: string) => r.actions?.find((a) => a.key === key)?.onSelect(),
                }
              : {}
          "
        >
          <NText>
            <span style="cursor: pointer">{{ r.header }}</span>
            <NButton quaternary v-if="r.url" text tag="a" :href="r.url" target="_blank">
              <template #icon>
                <NIcon size="tiny"><OpenOutline /></NIcon>
              </template>
            </NButton>
          </NText>
        </component>
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
} from '@/services-composable/attendance-record'
import { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import { OpenOutline } from '@vicons/ionicons5'
import { NButton, NDropdown, NEmpty, NIcon, NText, NTimeline, NTimelineItem, NSpin } from 'naive-ui'
import { computed } from 'vue'
import { useGoogleTasksQuery } from '@/services-composable/third-party/google-tasks'
import { attendanceRecord2Events, commits2Events, tasks2Events } from './EventsTimeline'

export type EventsTimelineDisplayPreset = [number, number]
/**
 * if undefined, events of that type will not be displayed
 */
export type EventsTimelineConfig = {
  attendance: { projectId?: string }
  github: { owner?: string; repo?: string }
  googleTask: { TasklistId?: string }
  googleCalendar: { calendarId?: string }
}

/**
 * 该组件通过传入的Config调用Hook获取数据。
 * 频繁改变参数可能会导致性能问题。
 */
const props = defineProps<{
  config: EventsTimelineConfig
  displayPreset?: EventsTimelineDisplayPreset
}>()

// Raw Data
const attendanceRecords = useAttendanceRecordQuery(
  () => props.config.attendance.projectId
)
const commits = useGithubListRepoCommitsQuery(
  () => props.config.github.owner,
  () => props.config.github.repo,
)
const tasks = useGoogleTasksQuery(() => props.config.googleTask?.TasklistId, true)

// UI state
const loading = computed(
  () => attendanceRecords.isLoading.value || commits.isLoading.value || tasks.isLoading.value,
)

// Events
const { mutate: deleteAttendance } = useAttendanceRecordDeleteMutate()
const attendanceEvents = computed(() =>
  attendanceRecord2Events(attendanceRecords.data.value, {
    onDelete: (id) => deleteAttendance(id),
  }),
)
const commitsEvents = computed(() => commits2Events(commits.data.value))
const tasksEvents = computed(() => tasks2Events(tasks.data.value?.items))

const filteredMergedEvents = computed(() => {
  const merged = [...attendanceEvents.value, ...commitsEvents.value, ...tasksEvents.value]
  return merged
    .filter((item) => {
      if (props.displayPreset) {
        const [start, end] = props.displayPreset
        return item.timestamp >= start && item.timestamp < end
      } else {
        return true
      }
    })
    .sort((a, b) => a.timestamp - b.timestamp)
})
</script>
