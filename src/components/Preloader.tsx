import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { profile } from '../data/resume'

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      onDone()
      return
    }
    const ctx = gsap.context(() => {
      const counter = { v: 0 }
      const tl = gsap.timeline({ onComplete: onDone })
      tl.from('.pl-letter', { yPercent: 110, stagger: 0.04, duration: 0.9, ease: 'expo.out' })
        .to(
          counter,
          {
            v: 100,
            duration: 1.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0,
        )
        .to('.pl-bar', { scaleX: 1, duration: 1.8, ease: 'power2.inOut' }, 0)
        .to('.pl-letter', { yPercent: -110, stagger: 0.02, duration: 0.6, ease: 'expo.in' }, '+=0.15')
        .to('.pl-meta', { opacity: 0, duration: 0.3 }, '<')
        .to('.pl-panel', { yPercent: -100, stagger: 0.06, duration: 1, ease: 'expo.inOut' }, '-=0.2')
    }, root)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div ref={root} className="fixed inset-0 z-[100] pointer-events-none" aria-hidden>
      <div className="absolute inset-0 flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="pl-panel h-full flex-1 bg-ink-2 border-r border-white/[0.03]" />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="flex overflow-hidden font-display text-5xl md:text-8xl font-extrabold tracking-tight">
          {profile.name.split('').map((c, i) => (
            <span key={i} className="pl-letter inline-block">
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </div>
        <div className="pl-meta w-56 md:w-72">
          <div className="h-px bg-white/10 overflow-hidden">
            <div className="pl-bar h-full origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan" />
          </div>
          <div className="mt-3 flex justify-between font-mono text-xs text-mist">
            <span>LOADING SCENE</span>
            <span ref={count}>000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
