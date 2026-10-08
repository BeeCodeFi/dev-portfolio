import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { profile } from '../data/resume'
import { SectionLabel, useScramble } from './shared'

const highlight = new Set(['scalable', 'enterprise', 'reusable', 'AWS.', 'AI', 'production', 'stability.'])

export default function About() {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  useScramble('Who I Am', titleRef)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const items = root.current?.querySelectorAll('.about-detail')
    if (items) gsap.set(items, { y: 30, opacity: 0 })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      // Word-by-word reveal on scrub
      gsap.fromTo(
        '.about-word',
        { opacity: 0.35 },
        {
          opacity: 1,
          stagger: 0.07,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 40%', scrub: true },
        },
      )
      // Portrait + rings slide in
      gsap.from('.about-portrait-wrap', {
        x: -50, opacity: 0, rotate: -2, duration: 1.4, ease: 'expo.out',
        immediateRender: false,
        scrollTrigger: { trigger: '.about-aside', start: 'top 88%', toggleActions: 'play none none none' },
      })
      // Detail items stagger up
      gsap.to('.about-detail', {
        y: 0, opacity: 1, stagger: 0.14, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-aside', start: 'top 85%', toggleActions: 'play none none none' },
      })
      // Portrait floats upward on scroll
      gsap.to('.about-portrait-wrap', {
        y: -20, ease: 'none',
        scrollTrigger: { trigger: '.about-aside', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} className="relative mx-auto max-w-7xl px-4 py-32 md:px-10 md:py-48">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/8 blur-[140px]" />

      {/* Section header */}
      <div className="mb-4">
        <SectionLabel index="01">About me</SectionLabel>
      </div>
      <h2
        ref={titleRef}
        className="font-display text-5xl font-extrabold tracking-tight md:text-7xl"
      >
        Who I Am
      </h2>

      <p className="about-text mt-12 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
        {profile.summary.split(' ').map((w, i) => (
          <span key={i} className={`about-word inline-block mr-[0.25em] transition-colors ${highlight.has(w) ? 'text-gradient' : ''}`}>
            {w}
          </span>
        ))}
      </p>

      <div className="about-aside mt-20 grid items-center gap-10 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">

        {/* Portrait with rings — borrowed from template */}
        <div className="about-portrait-wrap relative mt-10 flex flex-col items-center gap-6 self-center">
          {/* Spinning orbital rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer ring */}
            <div
              className="absolute rounded-full border border-violet/25"
              style={{ width: 360, height: 360, animation: 'ringRotate 18s linear infinite' }}
            />
            {/* Inner ring */}
            <div
              className="absolute rounded-full border border-cyan/20"
              style={{ width: 310, height: 310, animation: 'ringRotate 12s linear infinite reverse' }}
            />
            {/* Portrait */}
            <div className="group relative h-60 w-60 overflow-hidden rounded-full border-2 border-white/10 shimmer-border md:h-72 md:w-72">
              <img
                src={profile.dp}
                alt={`${profile.name} portrait`}
                loading="lazy"
                className="h-full w-full object-cover saturate-[0.85] transition-all duration-[1.4s] ease-out group-hover:scale-105 group-hover:saturate-100"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-violet/10" />
            </div>
          </div>

          {/* Status badge — borrowed from template */}

        </div>

        {/* Details */}
        <div className="flex flex-col justify-center gap-10">
          {[
            { label: 'Currently', value: 'Software Engineer at Cybage Software' },
            { label: 'Approach', value: 'Agile delivery, test-first quality, performance by default' },
            { label: 'Toolkit', value: 'React · Vue · Angular · .NET Core · Node · AWS' },
          ].map((item) => (
            <div key={item.label} className="about-detail group border-l-2 border-white/10 pl-5 transition-all duration-300 hover:border-violet/60">
              <div className="font-mono text-xs uppercase tracking-widest text-mist transition-colors group-hover:text-violet">{item.label}</div>
              <div className="mt-2 text-lg transition-colors group-hover:text-bone">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ringRotate {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}
