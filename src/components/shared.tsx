import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion, isIOS } from '../hooks/motion'

/** Pulls its child toward the cursor while hovered, then springs back. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    // Disable magnetic effect on iOS/touch devices to avoid issues
    if (!el || prefersReducedMotion() || isIOS()) return
    const x = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'elastic.out(1, 0.4)' })
    const y = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'elastic.out(1, 0.4)' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * strength)
      y((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { x(0); y(0) }
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
    }
  }, [strength])
  return <div ref={ref} className="inline-block">{children}</div>
}

/** "// Tag" style section label — borrowed from template */
export function SectionTag({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    gsap.set(ref.current, { opacity: 0, x: -12, force3D: !isIOS() })
  }, [])
  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.to(ref.current, {
      opacity: 1, x: 0, duration: 0.7, ease: 'power3.out', force3D: !isIOS(),
      scrollTrigger: { trigger: ref.current, start: 'top 93%', toggleActions: 'play none none none' },
    })
  }, [])
  return (
    <span ref={ref} className="font-mono text-sm text-cyan/80">
      {'// '}{children}
    </span>
  )
}

/** Numbered chapter label used at the top of each section. */
export function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div
      className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-mist"
      style={{ animation: 'sectionLabelIn 0.9s cubic-bezier(0.16,1,0.3,1) both' }}
    >
      <span className="text-gradient font-medium">{index}</span>
      <span style={{
        display: 'block',
        height: '1px',
        width: '48px',
        flexShrink: 0,
        background: 'linear-gradient(to right, rgba(139,92,246,0.85), rgba(34,211,238,0.6))'
      }} />
      <span>{children}</span>
    </div>
  )
}

/**
 * Text scramble hook — borrowed from template.
 * Scrambles random chars then resolves to the real text.
 */
export function useScramble(text: string, trigger: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = trigger.current
    if (!el) return
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        let iterations = 0
        const interval = setInterval(() => {
          el.textContent = text
            .split('')
            .map((char, index) => {
              if (index < iterations) return text[index]
              if (char === ' ') return ' '
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
          iterations += 1 / 3
          if (iterations >= text.length) {
            el.textContent = text
            clearInterval(interval)
          }
        }, 30)
      },
    })
    return () => st.kill()
  }, [text, trigger])
}

/**
 * Large heading whose lines slide up from a mask when scrolled into view.
 * Pre-hides with useLayoutEffect, then animates with gsap.to() — no restart jump.
 */
export function RevealHeading({ lines, className = '' }: { lines: ReactNode[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const els = ref.current?.querySelectorAll('.rh-line')
    if (els) gsap.set(els, { yPercent: 110, rotate: 1.5, force3D: !isIOS() })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to('.rh-line', {
        yPercent: 0,
        rotate: 0,
        duration: 1.3,
        stagger: 0.12,
        ease: 'expo.out',
        force3D: !isIOS(),
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
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
