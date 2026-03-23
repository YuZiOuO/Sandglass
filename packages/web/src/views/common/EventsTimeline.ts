import {
  useAttendanceRecordQuery,
  type AttendanceRecordType,
} from '@/services-composable/attendance-record'
import { attendanceModuleIconMap } from '../attendance/icon'
import { CheckboxOutline, GitCommitOutline, GitMergeOutline } from '@vicons/ionicons5'
import type { Component } from 'vue'
import type { TimelineItemProps } from 'naive-ui'
import type { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import type { googleTask } from '@/services-composable/third-party/google-tasks'

export type EventAction = {
  label: string
  key: string
  onSelect: () => void
}

export type Event = {
  // basic
  header: string
  timestamp: number
  content?: string
  url?: string

  // styles
  icon: Component
  timelineType: TimelineItemProps['type']
  lineDashed: boolean
  
  // actions
  actions?: EventAction[]
}

type Commits = ReturnType<typeof useGithubListRepoCommitsQuery>['data']['value']
export function commits2Events(c: Commits): Event[] {
  return (
    c?.map((item) => {
      return {
        timestamp: new Date(item.commit.author?.date ?? 0).getTime(),
        icon: item.parents.length > 1 ? GitMergeOutline : GitCommitOutline,
        lineDashed: false,
        header: 'Commit',
        content: item.commit.message + ' @' + item.sha.substring(0, 6),
        timelineType: 'info',
        url: item.html_url
      }
    }) ?? []
  )
}

type AttendanceRecords = ReturnType<typeof useAttendanceRecordQuery>['data']['value']
export function attendanceRecord2Events(
  r: AttendanceRecords,
  handlers?: { onDelete?: (id: string) => void },
): Event[] {
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
      const actions: EventAction[] = [
        {
          label: '删除',
          key: 'delete',
          onSelect: () => handlers?.onDelete?.(item.id),
        },
      ]

      return {
        timestamp: new Date(item.time).getTime(),
        icon: attendanceModuleIconMap[item.type],
        lineDashed: !(item.type === 'IN'),
        header: recordType2Name[item.type] + ' @ ' + item.projectId,
        timelineType: recordType2TimelineType[item.type],
        actions,
      }
    }) ?? []
  )
}

export function tasks2Events(t: googleTask[] | undefined): Event[] {
  return (
    t
      ?.filter((item) => !!item.completed)
      .map((item) => ({
        header: item.title!,
        icon: CheckboxOutline,
        lineDashed: true,
        timestamp: new Date(item.completed!).getTime(),
        timelineType: 'success',
        url: item.webViewLink,
      })) ?? []
  )
}
