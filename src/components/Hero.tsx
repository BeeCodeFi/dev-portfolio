import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, scrollToTarget } from '../hooks/motion'
import { profile } from '../data/resume'
import { Magnetic } from './shared'

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
          gsap.fromTo(el.current, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out' })
        },
      })
    }, 2800)
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

  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.set(root.current!.querySelectorAll('.hero-char'), { yPercent: 110 })
    gsap.set(root.current!.querySelectorAll('.hero-fade'), { opacity: 0, y: 24 })
  }, [])

  useEffect(() => {
    if (!start || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 })
      tl.to('.hero-char', { yPercent: 0, duration: 1.4, stagger: 0.032, ease: 'expo.out' }, 0)
        .to('.hero-fade', { opacity: 1, y: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out' }, 0.6)

      // Title drifts up on scroll exit only
      gsap.to('.hero-title', {
        yPercent: -30,
        opacity: 0.05,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [start])

  return (
    <section id="top" ref={root} className="relative h-svh min-h-[640px] w-full overflow-hidden">

      {/* ── Pure-CSS animated background ── */}
      <div className="absolute inset-0 bg-ink" />

      {/* Large slow-drifting ambient blobs */}
      <div
        className="absolute h-[70vw] w-[70vw] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%)',
          top: '-15%',
          right: '-10%',
          animation: 'blobA 18s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute h-[55vw] w-[55vw] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.6) 0%, transparent 70%)',
          bottom: '-20%',
          left: '-15%',
          animation: 'blobB 22s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute h-[40vw] w-[40vw] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)',
          top: '30%',
          left: '30%',
          animation: 'blobC 14s ease-in-out infinite alternate',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }} />

      {/* Content */}
      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 md:px-10 md:pb-14">


        {/* Right side Image (Desktop) */}
        <div className="hero-fade absolute right-4 md:right-10 lg:right-12 top-[45%] lg:top-[50%] -translate-y-1/2 hidden md:block w-48 h-48 md:w-72 md:h-72 lg:w-[28rem] lg:h-[28rem] rounded-full overflow-hidden pointer-events-auto border-2 border-bone/10 shadow-[0_0_40px_rgba(139,92,246,0.15)] z-20">
          <img
            src={profile.hero_dp}
            alt={profile.name}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out scale-105 hover:scale-100"
          />
        </div>

        <h1 className="hero-title font-display font-extrabold leading-[0.92] tracking-[-0.02em] text-[16vw] md:text-[13vw]">
          <SplitWord text={profile.firstName} />
          <SplitWord text={profile.lastName} className="outline-text" />
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
                className="flex items-center gap-2 rounded-full bg-bone px-7 py-4 text-sm font-semibold text-ink transition-all duration-300 hover:bg-white hover:shadow-[0_0_30px_rgba(237,233,226,0.3)]"
              >
                <span>View work</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </Magnetic>
            <Magnetic>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-semibold transition-all duration-300 hover:border-violet/60 hover:bg-violet/10 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]"
              >
                Get in touch
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Hero stats — from template */}
        <div className="hero-fade mt-8 flex gap-8 border-t border-white/10 pt-6">
          {[
            { value: '3+', label: 'Years Exp.' },
            { value: '20+', label: 'Projects' },
            { value: '10+', label: 'Technologies' },
          ].map((s) => (
            <div key={s.label} className="flex flex-col">
              <span className="font-display text-3xl font-extrabold text-gradient">{s.value}</span>
              <span className="mt-0.5 font-mono text-xs uppercase tracking-widest text-mist">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="hero-fade mt-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.3em] text-mist">
          <span className="relative block h-8 w-px overflow-hidden bg-white/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-bone" />
          </span>
          Scroll to begin
        </div>
      </div>

      <style>{`
        @keyframes blobA {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(-4%, 6%) scale(1.12); }
          100% { transform: translate(6%, -4%) scale(0.92); }
        }
        @keyframes blobB {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(6%, -5%) scale(1.08); }
          100% { transform: translate(-4%, 7%) scale(0.95); }
        }
        @keyframes blobC {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(3%, 4%) scale(1.15); }
          100% { transform: translate(-5%, -3%) scale(0.9); }
        }
        @keyframes scrollcue {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </section>
  )
}
