import { useEffect, useMemo, useState } from 'react'
import ClockDigital from './components/ClockDigital'
import ClockAnalog from './components/ClockAnalog'
import WeekEditor from './components/WeekEditor'
import SummaryPanel from './components/SummaryPanel'
import ImportExportModal from './components/ImportExportModal'
import {
  DEFAULT_SCHEDULE,
  DEFAULT_TARGETS,
  computeDayMinutes,
  computeWeeklyMinutes,
  type DayKey,
  type ScheduleState,
  type Targets,
} from './lib/time'

const STORAGE_KEY = 'work-hours-settings-v1'
const THEME_KEY = 'work-hours-theme'

type Theme = 'light' | 'dark'

function loadInitialState(): { schedule: ScheduleState; targets: Targets } {
  if (typeof window === 'undefined') {
    return { schedule: DEFAULT_SCHEDULE, targets: DEFAULT_TARGETS }
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { schedule: DEFAULT_SCHEDULE, targets: DEFAULT_TARGETS }
    const parsed = JSON.parse(raw) as {
      schedule?: ScheduleState
      targets?: Targets
    }
    return {
      schedule: parsed.schedule ?? DEFAULT_SCHEDULE,
      targets: parsed.targets ?? DEFAULT_TARGETS,
    }
  } catch {
    return { schedule: DEFAULT_SCHEDULE, targets: DEFAULT_TARGETS }
  }
}

function loadInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

function App() {
  const [now, setNow] = useState(() => new Date())
  const [{ schedule, targets }, setState] = useState(loadInitialState)
  const [theme, setTheme] = useState<Theme>(loadInitialTheme)
  const [isImportExportOpen, setIsImportExportOpen] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(new Date())
    }, 1000 / 4)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schedule,
        targets,
      }),
    )
  }, [schedule, targets])

  useEffect(() => {
    window.localStorage.setItem(THEME_KEY, theme)
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  const todayKey: DayKey = useMemo(() => {
    const jsDay = now.getDay() // 0-6, Sunday = 0
    const order: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
    return order[(jsDay + 6) % 7] // map JS Sunday=0 to our Monday=0
  }, [now])

  const dailyMinutes = useMemo(
    () => computeDayMinutes(schedule[todayKey]),
    [schedule, todayKey],
  )

  const weeklyMinutes = useMemo(
    () => computeWeeklyMinutes(schedule),
    [schedule],
  )

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleScheduleChange = (next: ScheduleState) => {
    setState((prev) => ({
      ...prev,
      schedule: next,
    }))
  }

  const handleTargetsChange = (next: Targets) => {
    setState((prev) => ({
      ...prev,
      targets: next,
    }))
  }

  const handleReset = () => {
    setState({
      schedule: DEFAULT_SCHEDULE,
      targets: DEFAULT_TARGETS,
    })
  }

  const handleImport = (payload: {
    schedule: ScheduleState
    targets: Targets
  }) => {
    setState({
      schedule: payload.schedule,
      targets: payload.targets,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-background dark:text-foreground flex flex-col">
      <div className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-foreground-muted">
              WORK HOURS
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Live clock & weekly overview
            </h1>
            <p className="text-sm text-foreground-muted">
              Track your schedule, see daily and weekly progress, and keep an eye
              on overtime.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleThemeToggle}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background-subtle px-3 py-1.5 text-xs font-medium text-foreground-muted shadow-soft transition hover:border-accent/60 hover:text-foreground"
            >
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-background-softer text-[10px]"
                aria-hidden="true"
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
              <span>{theme === 'dark' ? 'Dark' : 'Light'} mode</span>
            </button>
            <button
              type="button"
              onClick={() => setIsImportExportOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background-subtle px-3 py-1.5 text-xs font-medium text-foreground-muted shadow-soft transition hover:border-accent/60 hover:text-foreground"
            >
              <span className="text-base" aria-hidden="true">
                ⇅
              </span>
              <span>Import / Export</span>
            </button>
          </div>
        </header>

        <main className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
          <section className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
              <div className="rounded-3xl border border-border bg-gradient-to-br from-background-subtle to-background-softer p-4 sm:p-5 shadow-soft">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground-muted">
                      CURRENT TIME
                    </p>
                    <ClockDigital date={now} />
                  </div>
                  <div className="hidden sm:block">
                    <ClockAnalog date={now} size={120} />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-background-subtle p-4 sm:p-5 shadow-soft flex items-center justify-center sm:justify-end">
                <ClockAnalog date={now} size={140} />
              </div>
            </div>

            <WeekEditor schedule={schedule} onChange={handleScheduleChange} />
          </section>

          <aside className="space-y-4">
            <SummaryPanel
              now={now}
              schedule={schedule}
              targets={targets}
              todayKey={todayKey}
              todayMinutes={dailyMinutes}
              weeklyMinutes={weeklyMinutes}
              onTargetsChange={handleTargetsChange}
              onReset={handleReset}
            />
          </aside>
        </main>
      </div>

      <ImportExportModal
        open={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        value={{ schedule, targets }}
        onImport={handleImport}
      />
    </div>
  )
}

export default App
