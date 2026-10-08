import { useEffect, useRef } from 'react'
import { gsap, useIsTouch } from '../hooks/motion'

/** Dot + lagging ring. Grows over links/buttons, shows a label over [data-cursor]. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const touch = useIsTouch()

  useEffect(() => {
    if (touch) return
    document.body.classList.add('has-cursor')
    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.1 })
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e: PointerEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]')
      const text = el?.dataset.cursor ?? ''
      if (label.current) label.current.textContent = text
      gsap.to(ring.current, {
        scale: el ? (text ? 2.6 : 1.8) : 1,
        backgroundColor: text ? 'rgba(237,233,226,1)' : 'rgba(237,233,226,0)',
        duration: 0.35,
      })
      gsap.to(dot.current, { scale: el ? 0 : 1, duration: 0.25 })
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [touch])

  if (touch) return null
  return (
    <>
      <div
        ref={ring}
        className="fixed left-0 top-0 z-[90] pointer-events-none -ml-5 -mt-5 h-10 w-10 rounded-full border border-bone/60 mix-blend-difference flex items-center justify-center"
      >
        <span ref={label} className="text-[5px] font-mono uppercase tracking-widest text-ink" />
      </div>
      <div
        ref={dot}
        className="fixed left-0 top-0 z-[91] pointer-events-none -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference"
      />
    </>
  )
}
