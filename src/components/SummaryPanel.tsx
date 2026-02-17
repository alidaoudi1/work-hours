import {
  DAY_LABELS,
  computeDayMinutes,
  formatMinutesToHHMM,
  type DayKey,
  type ScheduleState,
  type Targets,
} from '../lib/time'

interface SummaryPanelProps {
  now: Date
  schedule: ScheduleState
  targets: Targets
  todayKey: DayKey
  todayMinutes: number
  weeklyMinutes: number
  onTargetsChange: (next: Targets) => void
  onReset: () => void
}

export default function SummaryPanel({
  now,
  schedule,
  targets,
  todayKey,
  todayMinutes,
  weeklyMinutes,
  onTargetsChange,
  onReset,
}: SummaryPanelProps) {
  const dailyDelta = todayMinutes - targets.dailyMinutes
  const weeklyDelta = weeklyMinutes - targets.weeklyMinutes

  const dailyProgress =
    targets.dailyMinutes > 0 ? Math.min(todayMinutes / targets.dailyMinutes, 2) : 0
  const weeklyProgress =
    targets.weeklyMinutes > 0 ? Math.min(weeklyMinutes / targets.weeklyMinutes, 2) : 0

  const handleDailyTargetChange = (value: string) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric) || numeric <= 0) return
    onTargetsChange({
      ...targets,
      dailyMinutes: numeric * 60,
    })
  }

  const handleWeeklyTargetChange = (value: string) => {
    const numeric = Number(value)
    if (Number.isNaN(numeric) || numeric <= 0) return
    onTargetsChange({
      ...targets,
      weeklyMinutes: numeric * 60,
    })
  }

  const todayLabel = DAY_LABELS[todayKey]

  const weeklyByDay = (Object.keys(schedule) as DayKey[]).map((key) => ({
    key,
    label: DAY_LABELS[key],
    minutes: computeDayMinutes(schedule[key]),
  }))

  const todayIsWeekend = todayKey === 'sat' || todayKey === 'sun'

  const hourOptions: Intl.NumberFormatOptions = { maximumFractionDigits: 2 }

  return (
    <section className="space-y-4 rounded-3xl border border-border bg-background-subtle p-4 sm:p-5 shadow-soft">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold tracking-tight">Summary</h2>
        <p className="text-xs text-foreground-muted">
          {todayIsWeekend
            ? 'Weekend mode. Weekly progress and totals only.'
            : `Today is ${todayLabel}. Targets and progress update live.`}
        </p>
      </div>

      <div className="space-y-3">
        <SummaryRow
          label="Today"
          primary={`${formatMinutesToHHMM(todayMinutes)} worked`}
          secondary={`Target ${formatMinutesToHHMM(targets.dailyMinutes)} · ${formatMinutesToHHMM(
            dailyDelta,
            { signed: true },
          )} vs target`}
          progress={dailyProgress}
        />
        <SummaryRow
          label="This week"
          primary={`${formatMinutesToHHMM(weeklyMinutes)} worked`}
          secondary={`Target ${formatMinutesToHHMM(
            targets.weeklyMinutes,
          )} · ${formatMinutesToHHMM(weeklyDelta, { signed: true })} vs target`}
          progress={weeklyProgress}
        />
      </div>

      <div className="grid gap-2 rounded-2xl border border-border bg-background-softer/60 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
            TARGETS
          </p>
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-foreground-muted hover:text-foreground transition"
          >
            Reset to default
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <TargetInput
            id="daily-target"
            label="Daily hours"
            value={(targets.dailyMinutes / 60).toLocaleString(undefined, hourOptions)}
            onChange={handleDailyTargetChange}
          />
          <TargetInput
            id="weekly-target"
            label="Weekly hours"
            value={(targets.weeklyMinutes / 60).toLocaleString(undefined, hourOptions)}
            onChange={handleWeeklyTargetChange}
          />
        </div>
      </div>

      <div className="space-y-2 rounded-2xl border border-border bg-background-softer/50 p-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
          BY DAY
        </p>
        <div className="space-y-1.5">
          {weeklyByDay.map((day) => {
            const isToday = day.key === todayKey
            return (
              <div
                key={day.key}
                className="flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 hover:bg-background-subtle/80 transition"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isToday ? 'bg-accent' : 'bg-foreground-muted/50'
                    }`}
                  />
                  <span
                    className={`text-xs ${
                      isToday ? 'font-medium text-foreground' : 'text-foreground-muted'
                    }`}
                  >
                    {day.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 text-xs font-mono tabular-nums">
                  <span className="text-foreground">
                    {formatMinutesToHHMM(day.minutes || 0)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p className="text-[11px] text-foreground-muted/80">
        Local time:{' '}
        <span className="font-mono">
          {now.toLocaleString(undefined, {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </p>
    </section>
  )
}

interface SummaryRowProps {
  label: string
  primary: string
  secondary: string
  progress: number
}

function SummaryRow({ label, primary, secondary, progress }: SummaryRowProps) {
  const pct = Math.min(progress * 100, 200)
  const pctClampedForBar = Math.min(pct, 100)

  return (
    <div className="space-y-1.5 rounded-2xl border border-border bg-background-softer/40 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
          {label}
        </p>
        <p className="text-xs font-mono tabular-nums text-foreground">{primary}</p>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-background-subtle">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent via-sky-400 to-emerald-400"
          style={{ width: `${pctClampedForBar}%` }}
        />
        {pct > 100 && (
          <div
            className="absolute inset-y-0 left-full w-6 -translate-x-1/2 bg-gradient-to-r from-emerald-400/60 to-transparent blur-[8px]"
            style={{ opacity: 0.7 }}
          />
        )}
      </div>
      <p className="text-[11px] text-foreground-muted">{secondary}</p>
    </div>
  )
}

interface TargetInputProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

function TargetInput({ id, label, value, onChange }: TargetInputProps) {
  return (
    <label htmlFor={id} className="space-y-1 text-xs">
      <span className="block text-[11px] text-foreground-muted">{label}</span>
      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-background-softer px-2 py-1.5 focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/40">
        <input
          id={id}
          type="number"
          step="0.25"
          min="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-full bg-transparent text-xs font-mono text-foreground outline-none ring-0"
        />
        <span className="text-[11px] text-foreground-muted">h</span>
      </div>
    </label>
  )
}

