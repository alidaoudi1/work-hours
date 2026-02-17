export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export const DAY_LABELS: Record<DayKey, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export interface TimeInterval {
  start: string | null
  end: string | null
}

export type DaySchedule = TimeInterval[]

export type ScheduleState = Record<DayKey, DaySchedule>

export interface Targets {
  /** in minutes */
  dailyMinutes: number
  /** in minutes */
  weeklyMinutes: number
}

export const DEFAULT_TARGETS: Targets = {
  dailyMinutes: 7.5 * 60, // 7.5h
  weeklyMinutes: 37.5 * 60, // 37.5h
}

export const DEFAULT_SCHEDULE: ScheduleState = {
  mon: [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:30' },
  ],
  tue: [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:30' },
  ],
  wed: [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:30' },
  ],
  thu: [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:30' },
  ],
  fri: [
    { start: '09:00', end: '12:00' },
    { start: '13:00', end: '17:30' },
  ],
  sat: [
    { start: null, end: null },
    { start: null, end: null },
  ],
  sun: [
    { start: null, end: null },
    { start: null, end: null },
  ],
}

export function parseTimeToMinutes(value: string | null | undefined): number | null {
  if (!value) return null
  const match = /^(\d{1,2}):(\d{2})$/.exec(value)
  if (!match) return null
  const hours = Number(match[1])
  const minutes = Number(match[2])
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null
  return hours * 60 + minutes
}

export function computeIntervalMinutes(interval: TimeInterval): number {
  const start = parseTimeToMinutes(interval.start)
  const end = parseTimeToMinutes(interval.end)
  if (start == null || end == null) return 0
  if (end <= start) return 0
  return end - start
}

export function computeDayMinutes(day: DaySchedule): number {
  return day.reduce((sum, interval) => sum + computeIntervalMinutes(interval), 0)
}

export function computeWeeklyMinutes(schedule: ScheduleState): number {
  return (Object.keys(schedule) as DayKey[]).reduce(
    (total, key) => total + computeDayMinutes(schedule[key]),
    0,
  )
}

export function formatMinutesToHHMM(totalMinutes: number, opts?: { signed?: boolean }): string {
  const signed = opts?.signed ?? false
  const sign = totalMinutes < 0 ? '-' : signed && totalMinutes > 0 ? '+' : ''
  const abs = Math.abs(totalMinutes)
  const hours = Math.floor(abs / 60)
  const minutes = abs % 60
  return `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

