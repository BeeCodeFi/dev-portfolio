import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, isIOS } from '../hooks/motion'
import { skills } from '../data/resume'
import { SectionLabel, useScramble } from './shared'

const all = skills.flatMap((s) => s.items)
const rowA = all.slice(0, Math.ceil(all.length / 2))
const rowB = all.slice(Math.ceil(all.length / 2))

function Marquee({ items, reverse, speed }: { items: string[]; reverse?: boolean; speed: string }) {
  const doubled = [...items, ...items]
  return (
    <div className="overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ ['--marquee-speed' as string]: speed }}>
        {doubled.map((s, i) => (
          <span key={i} className="flex items-center gap-8 px-4 font-display text-4xl font-bold whitespace-nowrap md:text-7xl">
            <span
              className={`transition-colors duration-300 ${i % 3 === 1 ? 'outline-text hover:text-bone/60' : i % 3 === 2 ? 'text-gradient' : 'text-bone/90'
                }`}
            >
              {s}
            </span>
            <span className="text-2xl text-violet/70 md:text-4xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  useScramble('Tools I direct every scene with.', titleRef)

  // Pre-hide cards and chips before first paint
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const force3D = !isIOS()
    const cards = root.current?.querySelectorAll('.skill-group')
    const chips = root.current?.querySelectorAll('.skill-chip')
    if (cards) gsap.set(cards, { y: 60, opacity: 0, scale: 0.96, force3D })
    if (chips) gsap.set(chips, { y: 25, opacity: 0, scale: 0.85, force3D })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const force3D = !isIOS()
    const ctx = gsap.context(() => {
      // Marquee section rotates subtly on scroll
      gsap.to('.skill-marquees', {
        rotate: -3,
        ease: 'none',
        force3D,
        scrollTrigger: { 
          trigger: '.skill-marquees', 
          start: 'top bottom', 
          end: 'bottom top', 
          scrub: isIOS() ? 0.5 : true,
        },
      })
      // Cards stagger in
      gsap.utils.toArray<HTMLElement>('.skill-group').forEach((g, i) => {
        gsap.to(g, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          delay: i * 0.05,
          ease: 'expo.out',
          force3D,
          scrollTrigger: { trigger: g, start: 'top 88%', toggleActions: 'play none none none' },
        })
        // Chips cascade in after card
        gsap.to(g.querySelectorAll('.skill-chip'), {
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.04,
          duration: 0.6,
          ease: 'back.out(2)',
          force3D,
          scrollTrigger: { trigger: g, start: 'top 85%', toggleActions: 'play none none none' },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const spot = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <section id="skills" ref={root} className="relative overflow-hidden py-32 md:py-40">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute left-0 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet/6 blur-[160px]" />
      <div className="pointer-events-none absolute right-0 bottom-1/4 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-cyan/6 blur-[130px]" />

      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="mb-4 flex items-center gap-6">
          <SectionLabel index="02">The Cast</SectionLabel>

        </div>
        <h2 ref={titleRef} className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-8xl">
          Tools I direct <span className="text-gradient">every scene with.</span>
        </h2>
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
            className={`skill-group shimmer-border group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 ${i === 0 ? 'lg:col-span-2' : ''} ${i === skills.length - 1 ? 'md:col-span-2' : ''}`}
          >
            {/* Cursor-following spotlight */}
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(380px_circle_at_var(--mx)_var(--my),rgba(139,92,246,0.14),transparent_60%)]" />
            {/* Top shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-baseline justify-between">
              <h3 className="font-display text-2xl font-bold transition-colors duration-300 group-hover:text-gradient-sim">
                {g.category}
              </h3>
              <span className="font-mono text-xs text-mist">0{i + 1}</span>
            </div>
            <div className="relative mt-6 flex flex-wrap gap-2">
              {g.items.map((s) => (
                <span
                  key={s}
                  className="skill-chip rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm text-bone/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet/50 hover:bg-violet/10 hover:text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.25)]"
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
