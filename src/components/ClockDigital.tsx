interface ClockDigitalProps {
  date: Date
}

function formatTime(date: Date) {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function ClockDigital({ date }: ClockDigitalProps) {
  return (
    <div className="space-y-1">
      <p className="font-mono text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums">
        {formatTime(date)}
      </p>
      <p className="text-xs text-foreground-muted uppercase tracking-[0.2em]">
        {formatDate(date)}
      </p>
    </div>
  )
}

