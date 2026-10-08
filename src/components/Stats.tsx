import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { stats } from '../data/resume'

export default function Stats() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>('.stat-num')
      if (prefersReducedMotion()) return
      nums.forEach((el) => {
        const target = Number(el.dataset.value)
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        })
      })
      gsap.from('.stat-card', {
        y: 80,
        opacity: 0,
        rotateX: -25,
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="mx-auto max-w-7xl px-4 pb-32 md:px-10" style={{ perspective: 1000 }}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="stat-card group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-6 md:p-8"
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet/20 blur-3xl transition-all duration-700 group-hover:bg-cyan/30 group-hover:scale-150" />
            <div className="relative font-display text-5xl font-extrabold md:text-7xl">
              <span className="stat-num" data-value={s.value}>
                {s.value}
              </span>
              <span className="text-gradient">{s.suffix}</span>
            </div>
            <div className="relative mt-4 text-sm text-mist md:text-base">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
