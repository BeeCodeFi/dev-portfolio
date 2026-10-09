import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion, isIOS } from '../hooks/motion'
import { stats } from '../data/resume'

export default function Stats() {
  const root = useRef<HTMLElement>(null)

  // Pre-hide cards before first paint
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const force3D = !isIOS()
    const cards = root.current?.querySelectorAll('.stat-card')
    if (cards) gsap.set(cards, { y: 100, opacity: 0, rotateX: isIOS() ? 0 : -30, scale: 0.9, force3D })
  }, [])

  useEffect(() => {
    const force3D = !isIOS()
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return

      // Cards fly in with 3D flip (disabled on iOS)
      gsap.to('.stat-card', {
        y: 0,
        opacity: 1,
        rotateX: 0,
        scale: 1,
        stagger: 0.1,
        duration: 1.3,
        ease: 'expo.out',
        force3D,
        scrollTrigger: { trigger: root.current, start: 'top 78%', toggleActions: 'play none none none' },
      })

      // Count-up animation
      gsap.utils.toArray<HTMLElement>('.stat-num').forEach((el) => {
        const target = Number(el.dataset.value)
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 2.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="mx-auto max-w-7xl px-4 pb-32 md:px-10" style={{ perspective: 1000 }}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {stats.map((s, idx) => (
          <div
            key={s.label}
            className="stat-card shimmer-border group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-2 p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 md:p-8"
          >
            {/* Animated glow blob */}
            <div
              className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150"
              style={{ background: idx % 2 === 0 ? 'rgba(139,92,246,0.25)' : 'rgba(34,211,238,0.2)' }}
            />
            {/* Inner shimmer line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative font-display text-5xl font-extrabold tabular-nums md:text-7xl">
              <span className="stat-num" data-value={s.value}>
                {s.value}
              </span>
              <span className="text-gradient">{s.suffix}</span>
            </div>
            <div className="relative mt-4 text-sm leading-relaxed text-mist transition-colors duration-300 group-hover:text-bone/80 md:text-base">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
