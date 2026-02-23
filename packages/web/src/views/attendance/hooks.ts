import type { AttendanceRecord } from '@/services-composable/attendance-record'
import type { AttendanceType } from '../../../../schema/generated/schemas'

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

export function groupByDate(records:AttendanceRecord[] | undefined){
  const initial = new Map<string, AttendanceRecord[]>();

  if(!records || records.length === 0){
    return initial
  }

  records.reduce((acc,cur) => {
    const key = new Date(cur.time).toLocaleDateString() // date of current record
    const group = acc.get(key) || [];
    group.push(cur);
    acc.set(key,group)
    return acc;
  },initial);

  return initial
}
