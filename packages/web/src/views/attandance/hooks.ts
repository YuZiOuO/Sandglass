import type { AttendanceRecord } from './AttandanceModule.vue'
import type { AttendanceType } from '../../../../schema/generated/schemas'

export function computeWorkTimeOfToday(records: AttendanceRecord[]) {
  let statusMachine: AttendanceType = 'OUT'
  let statusMachineCachedTime: Date = new Date()
  let statusMachineCountTimeMs = 0
  for (const r of records) {
    switch (r.type) {
      case 'IN':
        if (statusMachine == 'OUT') {
          statusMachineCachedTime = new Date(r.time)
          statusMachine = 'IN'
        }
        break
      case 'OUT':
        if (statusMachine == 'IN') {
          statusMachineCountTimeMs += new Date(r.time).getTime() - statusMachineCachedTime.getTime()
          statusMachine = 'OUT'
        }
    }
  }

  if (statusMachine == 'IN') {
    statusMachineCountTimeMs += new Date().getTime() - statusMachineCachedTime.getTime()
  }

  return statusMachineCountTimeMs
}
