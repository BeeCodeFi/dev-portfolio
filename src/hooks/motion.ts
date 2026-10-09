import { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isIOS = () => 
  typeof window !== 'undefined' && 
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
   (navigator.userAgent.includes('Mac') && 'ontouchend' in document))

let lenis: Lenis | null = null

export const getLenis = () => lenis

/** Inertial scrolling driven by the GSAP ticker so ScrollTrigger stays in sync. */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    // Disable smooth scroll on iOS devices as it causes issues
    if (!enabled || prefersReducedMotion() || isIOS()) return
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])
}

export function scrollToTarget(target: string) {
  if (lenis) lenis.scrollTo(target, { duration: 1.6, offset: 0 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export function useIsTouch() {
  const [touch, setTouch] = useState(false)
  useEffect(() => {
    setTouch(!window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])
  return touch
}

export { gsap, ScrollTrigger }
