import type { AttendanceCapability, AttendanceRecord, QueryRange } from '@/capability/attendance'

const STORAGE_KEY = 'sandglass.attendance.records.v1'

// Dates are serialized explicitly because JSON has no Date representation.
type StoredRecord = Omit<AttendanceRecord, 'time'> & { time: string }

export class LocalAttendanceAdapter implements AttendanceCapability {
  async record(record: Omit<AttendanceRecord, 'id'>) {
    const records = this.read()
    const saved: AttendanceRecord = {
      ...record,
      id: crypto.randomUUID(),
    }

    records.push(saved)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  }

  private read(): AttendanceRecord[] {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as StoredRecord[]
    return stored.map((record) => ({ ...record, time: new Date(record.time) }))
  }
}
