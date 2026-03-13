import {
  useAttendanceRecordDeleteMutate,
  useAttendanceRecordQuery,
  type AttendanceRecordType,
} from '@/services-composable/attendance-record'
import { attendanceModuleIconMap } from '../attendance/icon'
import { CheckboxOutline, GitCommitOutline, GitMergeOutline } from '@vicons/ionicons5'
import type { Component } from 'vue'
import type { DropdownOption, TimelineItemProps } from 'naive-ui'
import type { useGithubListRepoCommitsQuery } from '@/services-composable/third-party/github'
import type { googleTask } from '@/services-composable/third-party/google-tasks'

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
  dropDownOptions?: DropdownOption[]
  dropDownCallback?: (key: string, options: DropdownOption) => void
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
      }
    }) ?? []
  )
}

type AttendanceRecords = ReturnType<typeof useAttendanceRecordQuery>['data']['value']
export function attendanceRecord2Events(r: AttendanceRecords, projectId?: string): Event[] {
  const attendanceRecordDelete = useAttendanceRecordDeleteMutate()

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
        if (!projectId) {
          return true
        } else {
          return item.projectId === projectId
        }
      }) // filter those not in specified project // TODO: filter should not be done here
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
