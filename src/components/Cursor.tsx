import { useEffect, useRef } from 'react'
import { gsap, useIsTouch } from '../hooks/motion'

/** Premium cursor: dot + lagging ring + color shift on interactive elements */
export default function Cursor() {
  const dot   = useRef<HTMLDivElement>(null)
  const ring  = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const touch = useIsTouch()

  useEffect(() => {
    if (touch) return
    document.body.classList.add('has-cursor')

    const xDot  = gsap.quickTo(dot.current,  'x', { duration: 0.08 })
    const yDot  = gsap.quickTo(dot.current,  'y', { duration: 0.08 })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' })

    const move = (e: PointerEvent) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }

    const over = (e: PointerEvent) => {
      const el   = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]')
      const text = el?.dataset.cursor ?? ''
      if (label.current) label.current.textContent = text

      const isInteractive = !!el
      const hasLabel      = !!text

      gsap.to(ring.current, {
        scale: hasLabel ? 2.8 : isInteractive ? 2.0 : 1,
        backgroundColor: hasLabel
          ? 'rgba(237,233,226,1)'
          : isInteractive
          ? 'rgba(139,92,246,0.15)'
          : 'rgba(237,233,226,0)',
        borderColor: isInteractive && !hasLabel ? 'rgba(139,92,246,0.8)' : 'rgba(237,233,226,0.6)',
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot.current, {
        scale: isInteractive ? 0 : 1,
        duration: 0.2,
      })
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover',  over)
    return () => {
      document.body.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover',  over)
    }
  }, [touch])

  if (touch) return null

  return (
    <>
      {/* Lagging ring */}
      <div
        ref={ring}
        className="fixed left-0 top-0 z-[90] pointer-events-none -ml-5 -mt-5 h-10 w-10 rounded-full border border-bone/50 mix-blend-difference flex items-center justify-center transition-[border-color] duration-300"
      >
        <span
          ref={label}
          className="text-[5px] font-mono uppercase tracking-widest text-ink font-semibold"
        />
      </div>
      {/* Fast dot */}
      <div
        ref={dot}
        className="fixed left-0 top-0 z-[91] pointer-events-none -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-bone mix-blend-difference"
      />
    </>
  )
}
