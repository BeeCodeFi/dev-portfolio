import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { skills } from '../data/resume'
import { RevealHeading, SectionLabel } from './shared'

const all = skills.flatMap((s) => s.items)
const rowA = all.slice(0, Math.ceil(all.length / 2))
const rowB = all.slice(Math.ceil(all.length / 2))

function Marquee({ items, reverse, speed }: { items: string[]; reverse?: boolean; speed: string }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ ['--marquee-speed' as string]: speed }}>
        {doubled.map((s, i) => (
          <span key={i} className="flex items-center gap-8 px-4 font-display text-4xl font-bold whitespace-nowrap md:text-7xl">
            <span className={i % 3 === 1 ? 'outline-text' : i % 3 === 2 ? 'text-gradient' : ''}>{s}</span>
            <span className="text-2xl text-violet md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to('.skill-marquees', {
        rotate: -4,
        ease: 'none',
        scrollTrigger: { trigger: '.skill-marquees', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.utils.toArray<HTMLElement>('.skill-group').forEach((g) => {
        gsap.from(g.querySelectorAll('.skill-chip'), {
          y: 30,
          opacity: 0,
          scale: 0.8,
          stagger: 0.04,
          duration: 0.7,
          ease: 'back.out(2)',
          scrollTrigger: { trigger: g, start: 'top 85%' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Spotlight that follows the pointer within each card.
  const spot = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section id="skills" ref={root} className="relative overflow-hidden py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <SectionLabel index="02">The Cast</SectionLabel>
        <RevealHeading lines={['Tools I direct', <span className="text-gradient">every scene with.</span>]} className="mt-8 text-5xl md:text-8xl" />
      </div>

      <div className="skill-marquees my-20 -mx-10 md:my-28">
        <Marquee items={rowA} speed="55s" />
        <Marquee items={rowB} reverse speed="65s" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-4 px-4 md:grid-cols-2 md:px-10 lg:grid-cols-3">
        {skills.map((g, i) => (
          <div
            key={g.category}
            onPointerMove={spot}
            className={`skill-group group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-7 ${i === 0 ? 'lg:col-span-2' : ''} ${i === skills.length - 1 ? 'md:col-span-2' : ''}`}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(400px_circle_at_var(--mx)_var(--my),rgba(139,92,246,0.18),transparent_60%)]" />
            <div className="relative flex items-baseline justify-between">
              <h3 className="font-display text-2xl font-bold">{g.category}</h3>
              <span className="font-mono text-xs text-mist">0{i + 1}</span>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="skill-chip rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-bone/85 transition hover:-translate-y-0.5 hover:border-violet/60 hover:text-white"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
