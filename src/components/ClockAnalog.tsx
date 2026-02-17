interface ClockAnalogProps {
  date: Date
  size?: number
}

export default function ClockAnalog({ date, size = 140 }: ClockAnalogProps) {
  const seconds = date.getSeconds() + date.getMilliseconds() / 1000
  const minutes = date.getMinutes() + seconds / 60
  const hours = (date.getHours() % 12) + minutes / 60

  const secondAngle = seconds * 6 // 360 / 60
  const minuteAngle = minutes * 6
  const hourAngle = hours * 30 // 360 / 12

  const strokeBase = '#1f2937'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className="drop-shadow-soft text-foreground"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="clockFace" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#111827" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <linearGradient id="clockBorder" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="clockSecond" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97373" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>

      <circle
        cx="50"
        cy="50"
        r="47"
        fill="url(#clockFace)"
        stroke="url(#clockBorder)"
        strokeWidth="1.5"
      />

      <g stroke={strokeBase} strokeWidth="0.5">
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i / 60) * 2 * Math.PI
          const cos = Math.cos(angle)
          const sin = Math.sin(angle)
          const outerRadius = 46
          const innerRadius = i % 5 === 0 ? 42 : 44
          const x1 = 50 + outerRadius * sin
          const y1 = 50 - outerRadius * cos
          const x2 = 50 + innerRadius * sin
          const y2 = 50 - innerRadius * cos
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} opacity={i % 5 === 0 ? 0.72 : 0.32} />
        })}
      </g>

      <circle cx="50" cy="50" r="1.5" fill="#020617" />
      <circle cx="50" cy="50" r="0.9" fill="#e5e7eb" />

      <g
        style={{
          transform: `rotate(${hourAngle}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <line
          x1="50"
          y1="52"
          x2="50"
          y2="30"
          stroke="#e5e7eb"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </g>

      <g
        style={{
          transform: `rotate(${minuteAngle}deg)`,
          transformOrigin: '50% 50%',
        }}
      >
        <line
          x1="50"
          y1="53"
          x2="50"
          y2="23"
          stroke="#e5e7eb"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>

      <g
        style={{
          transform: `rotate(${secondAngle}deg)`,
          transformOrigin: '50% 50%',
          transition: 'transform 0.15s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
      >
        <line
          x1="50"
          y1="54"
          x2="50"
          y2="18"
          stroke="url(#clockSecond)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="53"
          x2="50"
          y2="60"
          stroke="url(#clockSecond)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity={0.6}
        />
      </g>
    </svg>
  )
}

