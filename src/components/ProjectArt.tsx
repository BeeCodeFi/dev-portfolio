import type { Project } from '../data/resume'

/** Generated, animated SVG key art per project (stand-ins until real screenshots exist). */
export default function ProjectArt({ motif, palette: [a, b] }: Pick<Project, 'motif' | 'palette'>) {
  const id = `g-${motif}`
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor={a} stopOpacity="0.35" />
          <stop offset="1" stopColor={b} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="white" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="400" height="300" fill="#0b0b12" />
      <rect width="400" height="300" fill={`url(#${id}-grid)`} />
      <circle cx="200" cy="150" r="180" fill={`url(#${id}-glow)`} />
      {motif === 'social' && <Social id={id} />}
      {motif === 'travel' && <Travel id={id} />}
      {motif === 'finance' && <Finance id={id} />}
    </svg>
  )
}

function Social({ id }: { id: string }) {
  const nodes: [number, number, number][] = [
    [200, 150, 22], [110, 90, 12], [300, 85, 14], [90, 210, 10], [310, 215, 12], [200, 55, 8], [200, 250, 9], [150, 175, 6], [255, 130, 7],
  ]
  return (
    <g>
      {nodes.slice(1).map(([x, y], i) => (
        <line key={i} x1="200" y1="150" x2={x} y2={y} stroke={`url(#${id})`} strokeOpacity="0.5" strokeDasharray="4 4">
          <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.2s" repeatCount="indefinite" />
        </line>
      ))}
      {nodes.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill={`url(#${id})`} opacity={i === 0 ? 1 : 0.85} />
          <circle cx={x} cy={y} r={r} fill="none" stroke={`url(#${id})`}>
            <animate attributeName="r" from={r} to={r * 2.6} dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.7" to="0" dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </g>
  )
}

function Travel({ id }: { id: string }) {
  const arcs = ['M60 220 Q 200 20 340 200', 'M80 120 Q 220 260 330 90', 'M40 170 Q 180 80 300 150']
  return (
    <g>
      <ellipse cx="200" cy="150" rx="130" ry="130" fill="none" stroke="white" strokeOpacity="0.08" />
      <ellipse cx="200" cy="150" rx="60" ry="130" fill="none" stroke="white" strokeOpacity="0.08" />
      <ellipse cx="200" cy="150" rx="130" ry="45" fill="none" stroke="white" strokeOpacity="0.08" />
      {arcs.map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth="2" strokeDasharray="6 8" opacity="0.8">
            <animate attributeName="stroke-dashoffset" from="0" to="-56" dur="2s" repeatCount="indefinite" />
          </path>
          <circle r="5" fill="white">
            <animateMotion dur={`${3 + i}s`} repeatCount="indefinite" path={d} />
          </circle>
        </g>
      ))}
    </g>
  )
}

function Finance({ id }: { id: string }) {
  const bars = [60, 90, 75, 120, 105, 150, 140, 185]
  return (
    <g>
      {bars.map((h, i) => (
        <rect key={i} x={60 + i * 38} width="22" rx="4" y={250 - h} height={h} fill={`url(#${id})`} opacity={0.25 + i * 0.09}>
          <animate attributeName="height" values={`${h};${h * 0.75};${h}`} dur={`${2 + (i % 3) * 0.6}s`} repeatCount="indefinite" />
          <animate attributeName="y" values={`${250 - h};${250 - h * 0.75};${250 - h}`} dur={`${2 + (i % 3) * 0.6}s`} repeatCount="indefinite" />
        </rect>
      ))}
      <polyline
        points={bars.map((h, i) => `${71 + i * 38},${235 - h}`).join(' ')}
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeDasharray="600"
        strokeDashoffset="600"
      >
        <animate attributeName="stroke-dashoffset" values="600;0;0;600" keyTimes="0;0.4;0.8;1" dur="5s" repeatCount="indefinite" />
      </polyline>
      <text x="60" y="50" fill="white" opacity="0.6" fontFamily="JetBrains Mono, monospace" fontSize="11">
        AI · PARTNER SIGNALS
      </text>
    </g>
  )
}
