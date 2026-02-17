import { DAY_LABELS, type DayKey, type DaySchedule, type ScheduleState } from '../lib/time'
import DayCard from './DayCard'

interface WeekEditorProps {
  schedule: ScheduleState
  onChange: (next: ScheduleState) => void
}

export default function WeekEditor({ schedule, onChange }: WeekEditorProps) {
  const handleDayChange = (key: DayKey, nextDay: DaySchedule) => {
    onChange({
      ...schedule,
      [key]: nextDay,
    })
  }

  const orderedDays: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight">Weekly schedule</h2>
          <p className="text-xs text-foreground-muted">
            Configure one or two work blocks per day. Empty days are treated as days off.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {orderedDays.map((key) => (
          <DayCard key={key} dayKey={key} schedule={schedule[key]} onChange={(d) => handleDayChange(key, d)} />
        ))}
      </div>
      <p className="text-[11px] text-foreground-muted/80">
        Times are local to your browser. Validation ensures end times must be after start times;
        invalid ranges are ignored in totals.
      </p>
    </section>
  )
}

