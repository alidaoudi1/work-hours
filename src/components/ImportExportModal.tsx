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
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-background-subtle p-4 sm:p-5 shadow-soft">
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
            className="rounded-full border border-border bg-background-softer px-2 py-1 text-xs text-foreground-muted hover:text-foreground"
          >
            Esc
          </button>
        </div>

        <form className="space-y-3" onSubmit={handleImport}>
          <textarea
            name="payload"
            defaultValue={defaultValue}
            className="h-52 w-full resize-none rounded-2xl border border-border bg-background-softer p-3 text-xs font-mono text-foreground outline-none ring-0 focus:border-accent focus:ring-1 focus:ring-accent/40"
            spellCheck={false}
          />
          <div className="flex items-center justify-between gap-2 text-[11px] text-foreground-muted">
            <p>
              Structure:{' '}
              <code className="rounded bg-background-softer px-1 py-0.5 text-[10px]">
                {'{ schedule, targets }'}
              </code>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border bg-background-softer px-3 py-1 text-[11px] text-foreground-muted hover:text-foreground"
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

