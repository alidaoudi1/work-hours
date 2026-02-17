import {
  DAY_LABELS,
  computeDayMinutes,
  formatMinutesToHHMM,
  type DayKey,
  type DaySchedule,
  type TimeInterval,
} from '../lib/time'

interface DayCardProps {
  dayKey: DayKey
  schedule: DaySchedule
  onChange: (next: DaySchedule) => void
}

const EMPTY_INTERVAL: TimeInterval = { start: null, end: null }

export default function DayCard({ dayKey, schedule, onChange }: DayCardProps) {
  const totalMinutes = computeDayMinutes(schedule)

  const handleIntervalChange = (index: number, field: keyof TimeInterval, value: string) => {
    const next = schedule.map((interval, i) =>
      i === index ? { ...interval, [field]: value || null } : interval,
    )
    onChange(next)
  }

  const handleClearDay = () => {
    onChange([EMPTY_INTERVAL, EMPTY_INTERVAL])
  }

  const ensureTwoIntervals = () => {
    if (schedule.length >= 2) return schedule
    if (schedule.length === 1) return [schedule[0], EMPTY_INTERVAL]
    return [EMPTY_INTERVAL, EMPTY_INTERVAL]
  }

  const effectiveSchedule = ensureTwoIntervals()

  const hasAnyValue = effectiveSchedule.some((i) => i.start || i.end)

  const intervalHasError = (interval: TimeInterval) => {
    if (!interval.start || !interval.end) return false
    return interval.end <= interval.start
  }

  return (
    <div className="rounded-2xl border border-border bg-background-subtle/80 px-3 py-3 sm:px-4 sm:py-4 shadow-soft">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground-muted">
          {DAY_LABELS[dayKey]}
        </p>
        <button
          type="button"
          onClick={handleClearDay}
          className="text-[11px] text-foreground-muted hover:text-foreground transition"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {effectiveSchedule.map((interval, index) => {
          const hasError = intervalHasError(interval)
          return (
            <div key={index} className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-1.5">
                <input
                  type="time"
                  value={interval.start ?? ''}
                  onChange={(e) => handleIntervalChange(index, 'start', e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-background-softer px-2 text-xs font-mono text-foreground outline-none ring-0 transition focus:border-accent focus:ring-1 focus:ring-accent/40"
                />
                <span className="text-xs text-foreground-muted">–</span>
                <input
                  type="time"
                  value={interval.end ?? ''}
                  onChange={(e) => handleIntervalChange(index, 'end', e.target.value)}
                  className="h-8 w-full rounded-lg border border-border bg-background-softer px-2 text-xs font-mono text-foreground outline-none ring-0 transition focus:border-accent focus:ring-1 focus:ring-accent/40"
                />
              </div>
              {index === 0 && (
                <span className="hidden text-[11px] text-foreground-muted sm:inline">
                  Morning
                </span>
              )}
              {index === 1 && (
                <span className="hidden text-[11px] text-foreground-muted sm:inline">
                  Afternoon
                </span>
              )}
              <div className="w-1.5">
                {hasError && (
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-danger" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[11px] text-foreground-muted">
          {hasAnyValue ? (
            <>
              Total:{' '}
              <span className="font-mono text-xs text-foreground">
                {formatMinutesToHHMM(totalMinutes)}
              </span>
            </>
          ) : (
            <span className="italic text-foreground-muted/70">No work planned</span>
          )}
        </p>
      </div>
    </div>
  )
}

