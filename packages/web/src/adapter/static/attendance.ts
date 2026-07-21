import type { AttendanceCapability, AttendanceRecord, QueryRange } from '@/capability/attendance'
import type { StatePort } from '@/interfaces'
import type { JsonObject } from 'type-fest'

export type AttendanceState = JsonObject & {
  records: readonly (Omit<AttendanceRecord, 'time'> & { time: string })[]
}

export class AttendanceAdapter implements AttendanceCapability {
  constructor(private readonly state: StatePort<AttendanceState>) {}

  async record(record: Omit<AttendanceRecord, 'id'>) {
    const records = this.read()
    const saved: AttendanceRecord = {
      ...record,
      id: crypto.randomUUID(),
    }

    records.push(saved)
    this.write(records)
    return saved
  }

  async list(range?: QueryRange) {
    return this.read()
      .filter(
        ({ time }) =>
          !range || ((!range.from || time >= range.from) && (!range.to || time < range.to)),
      )
      .sort((a, b) => a.time.getTime() - b.time.getTime())
  }

  async remove(id: string) {
    const records = this.read().filter((record) => record.id !== id)
    this.write(records)
  }

  private read(): AttendanceRecord[] {
    return this.state.read().records.map((record) => ({ ...record, time: new Date(record.time) }))
  }

  private write(records: readonly AttendanceRecord[]) {
    this.state.write({
      records: records.map((record) => ({ ...record, time: record.time.toISOString() })),
    })
  }
}
