import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, scrollToTarget } from '../hooks/motion'
import { profile } from '../data/resume'
import { Magnetic } from './shared'

const HeroScene = lazy(() => import('./HeroScene'))

function SplitWord({ text, className = '' }: { text: string; className?: string }) {
  return (
    <span className={`mask whitespace-nowrap ${className}`} aria-label={text}>
      {text.split('').map((c, i) => (
        <span key={i} className="hero-char inline-block" aria-hidden>
          {c}
        </span>
      ))}
    </span>
  )
}

function RoleTicker() {
  const [i, setI] = useState(0)
  const el = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const id = setInterval(() => {
      gsap.to(el.current, {
        yPercent: -100,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          setI((n) => (n + 1) % profile.roles.length)
          gsap.fromTo(el.current, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        },
      })
    }, 2600)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="mask inline-block align-bottom">
      <span ref={el} className="inline-block text-gradient">
        {profile.roles[i]}
      </span>
    </span>
  )
}

export default function Hero({ start }: { start: boolean }) {
  const root = useRef<HTMLElement>(null)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  // Hide intro elements until the preloader hands over.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    gsap.set(root.current!.querySelectorAll('.hero-char'), { yPercent: 110 })
    gsap.set(root.current!.querySelectorAll('.hero-fade'), { opacity: 0, y: 20 })
    gsap.set(root.current!.querySelector('.hero-canvas'), { opacity: 0, scale: 0.7 })
  }, [])

  useEffect(() => {
    if (!start || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1 })
      tl.to('.hero-canvas', { opacity: 1, scale: 1, duration: 2.2, ease: 'expo.out' })
        .to('.hero-char', { yPercent: 0, duration: 1.3, stagger: 0.035, ease: 'expo.out' }, 0.2)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }, 0.9)

      // Exit: as you scroll away the title drifts up and the orb pushes back.
      gsap.to('.hero-title', {
        yPercent: -30,
        opacity: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-canvas', {
        scale: 0.6,
        opacity: 0,
        yPercent: 20,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [start])

  return (
    <section id="top" ref={root} className="relative h-svh min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(139,92,246,0.18),transparent_60%)]" />
      <div className="hero-canvas absolute inset-0">
        <Suspense fallback={null}>
          <HeroScene pointer={pointer} />
        </Suspense>
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 md:px-10 md:pb-14">
        <div className="hero-fade mb-6 font-mono text-xs uppercase tracking-[0.3em] text-mist">
          Portfolio — Vol. 01 / {new Date().getFullYear()}
        </div>
        <h1 className="hero-title font-display font-extrabold leading-[0.85] tracking-[-0.04em] text-[16vw] md:text-[13vw]">
          <SplitWord text={profile.firstName} />
          <SplitWord text={profile.lastName} className="outline-text md:pl-[12vw]" />
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="hero-fade max-w-md text-lg text-bone/80 md:text-xl">
            <RoleTicker />
            <br />
            building scalable, cinematic web experiences with React, Vue, Angular &amp; .NET.
          </p>
          <div className="hero-fade pointer-events-auto flex items-center gap-4">
            <Magnetic>
              <button
                onClick={() => scrollToTarget('#projects')}
                className="rounded-full bg-bone px-7 py-4 text-sm font-semibold text-ink transition hover:bg-white"
              >
                View work
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-semibold transition hover:border-white/60"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>
        <div className="hero-fade mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
          <span className="relative block h-8 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-bone" />
          </span>
          Scroll to begin
        </div>
      </div>
      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
