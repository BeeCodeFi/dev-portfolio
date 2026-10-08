import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { education } from '../data/resume'
import { SectionLabel } from './shared'

export default function Education() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.edu-bg', { yPercent: -15 }, { yPercent: 15, ease: 'none', scrollTrigger: { trigger: root.current, scrub: true } })
      gsap.from('.edu-card', {
        clipPath: 'inset(20% 20% 20% 20% round 2rem)',
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="mx-auto max-w-7xl px-4 py-32 md:px-10 md:py-40">
      <SectionLabel index="05">Flashback — Education</SectionLabel>
      <div className="edu-card relative mt-12 overflow-hidden rounded-[2rem] border border-white/10" style={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}>
        <div className="edu-bg absolute -inset-y-[20%] inset-x-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(139,92,246,0.35),transparent_55%),radial-gradient(ellipse_at_85%_80%,rgba(34,211,238,0.25),transparent_50%)]" />
        <div className="relative grid gap-8 p-8 md:grid-cols-[1fr_auto] md:items-end md:p-16">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-mist">{education.period}</div>
            <h3 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-5xl">{education.degree}</h3>
            <div className="mt-4 text-xl text-bone/80">{education.school}</div>
          </div>
          <div className="font-display text-6xl font-extrabold md:text-8xl">
            8.0<span className="text-2xl text-mist md:text-3xl"> / 10</span>
            <div className="font-mono text-xs font-normal uppercase tracking-widest text-mist">CGPA</div>
          </div>
        </div>
      </div>
    </section>
  )
}
