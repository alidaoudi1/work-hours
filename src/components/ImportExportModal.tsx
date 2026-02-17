import type { FormEvent } from 'react'
import { DEFAULT_SCHEDULE, DEFAULT_TARGETS, type ScheduleState, type Targets } from '../lib/time'

interface ImportExportModalProps {
  open: boolean
  onClose: () => void
  value: {
    schedule: ScheduleState
    targets: Targets
  }
  onImport: (payload: { schedule: ScheduleState; targets: Targets }) => void
}

export default function ImportExportModal({
  open,
  onClose,
  value,
  onImport,
}: ImportExportModalProps) {
  if (!open) return null

  const handleImport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const raw = String(formData.get('payload') || '').trim()
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as {
        schedule?: ScheduleState
        targets?: Targets
      }
      onImport({
        schedule: parsed.schedule ?? DEFAULT_SCHEDULE,
        targets: parsed.targets ?? DEFAULT_TARGETS,
      })
      onClose()
    } catch {
      // Simple fallback: keep modal open; in a fuller app we'd surface the error.
      // Intentionally silent to keep UI minimal.
    }
  }

  const defaultValue = JSON.stringify(value, null, 2)

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm dark:bg-black/50">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-4 shadow-lg dark:border-border dark:bg-background-subtle sm:p-5 dark:shadow-soft">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold tracking-tight">Import / Export JSON</h2>
            <p className="text-[11px] text-foreground-muted">
              Copy your current setup or paste a JSON payload to restore.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 bg-sky-50 px-2 py-1 text-xs text-foreground-muted hover:text-foreground dark:border-border dark:bg-background-softer"
          >
            Esc
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleImport}>
          <textarea
            name="payload"
            defaultValue={defaultValue}
            className="h-52 w-full resize-none rounded-2xl border border-slate-200 bg-sky-50 p-3 text-xs font-mono text-slate-900 outline-none ring-0 focus:border-accent focus:ring-1 focus:ring-accent/40 dark:border-border dark:bg-background-softer dark:text-foreground"
            spellCheck={false}
          />
          <div className="flex items-center justify-between gap-2 text-[11px] text-foreground-muted">
            <p>
              Structure:{' '}
              <code className="rounded bg-sky-50 px-1 py-0.5 text-[10px] dark:bg-background-softer">
                {'{ schedule, targets }'}
              </code>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-slate-200 bg-sky-50 px-3 py-1 text-[11px] text-foreground-muted hover:text-foreground dark:border-border dark:bg-background-softer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-accent px-3 py-1 text-[11px] font-medium text-white shadow-soft hover:bg-accent-soft"
              >
                Import
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

