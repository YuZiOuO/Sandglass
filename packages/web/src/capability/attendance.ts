import type { Capability } from '@/interfaces'

export interface AttendanceCapability extends Capability {
  record: (record: Omit<AttendanceRecord, 'id'>) => Promise<AttendanceRecord>
  list: (range?: QueryRange) => Promise<readonly AttendanceRecord[]>
  remove: (id: string) => Promise<void>
}

export type AttendanceRecord = {
  id: string
  time: Date
  type: 'IN' | 'PAUSE' | 'OUT'
}

export type QueryRange =
  | {
      from: Date
      to?: Date
    }
  | {
      from?: Date
      to: Date
    }
