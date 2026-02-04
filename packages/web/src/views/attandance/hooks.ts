import type { AttendanceRecord } from './AttandanceModule.vue'
import type { AttendanceType } from '../../../../schema/generated/schemas'

const attendanceTypeStateTransition: Record<AttendanceType, AttendanceType[]> = {
  IN: ['OUT', 'PAUSE'],
  OUT: ['IN'],
  PAUSE: ['IN'],
}

export function computeWorkTimeOfToday(records: AttendanceRecord[]) {
  let statusMachine: AttendanceType = 'OUT'
  let statusMachineCachedTime: Date = new Date()
  let statusMachineCountTimeMs = 0
  for (const r of records) {
    switch (r.type) {
      case 'IN':
        if (statusMachine != 'IN') {
          statusMachineCachedTime = new Date(r.time)
          statusMachine = 'IN'
        }
        break

      case 'OUT':
      case 'PAUSE':
        if (statusMachine == 'IN') {
          statusMachineCountTimeMs += new Date(r.time).getTime() - statusMachineCachedTime.getTime()
        }
        statusMachine = r.type
    }
  }

  if (statusMachine == 'IN') {
    statusMachineCountTimeMs += new Date().getTime() - statusMachineCachedTime.getTime()
  }

  return statusMachineCountTimeMs
}
