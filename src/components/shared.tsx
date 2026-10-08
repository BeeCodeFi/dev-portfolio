import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'

/** Pulls its child toward the cursor while hovered, then springs back. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * strength)
      y((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return (
    <div ref={ref} className="inline-block">
      {children}
    </div>
  )
}

/** Numbered chapter label used at the top of each section. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="reveal-label flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-mist">
      <span className="text-gradient font-medium">{index}</span>
      <span className="h-px w-12 bg-white/20" />
      <span>{children}</span>
    </div>
  )
}

/** Large heading whose lines slide up from a mask when scrolled into view. */
export function RevealHeading({ lines, className = '' }: { lines: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.rh-line', {
        yPercent: 105,
        rotate: 2,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 85%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  return (
    <h2 ref={ref} className={`font-display font-extrabold leading-[0.95] tracking-tight ${className}`}>
      {lines.map((l, i) => (
        <span key={i} className="mask">
          <span className="rh-line block origin-bottom-left">{l}</span>
        </span>
      ))}
    </h2>
  )
}
