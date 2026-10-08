import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { profile } from '../data/resume'
import { SectionLabel } from './shared'

const highlight = new Set(['scalable', 'enterprise', 'reusable', 'AWS.', 'AI', 'production', 'stability.'])

export default function About() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.08,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.from('.about-aside > *', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-aside', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={root} className="relative mx-auto max-w-7xl px-4 py-32 md:px-10 md:py-48">
      <SectionLabel index="01">The Story</SectionLabel>
      <p className="about-text mt-12 font-display text-3xl font-bold leading-[1.15] tracking-tight md:text-5xl lg:text-6xl">
        {profile.summary.split(' ').map((w, i) => (
          <span key={i} className={`about-word inline-block mr-[0.25em] ${highlight.has(w) ? 'text-gradient' : ''}`}>
            {w}
          </span>
        ))}
      </p>
      <div className="about-aside mt-20 grid gap-10 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,340px)_1fr] md:gap-16">
        <div className="group relative aspect-square w-full max-w-[340px] overflow-hidden rounded-[2rem] border border-white/10">
          <img
            src={profile.dp}
            alt={`${profile.name} portrait`}
            loading="lazy"
            className="h-full w-full object-cover saturate-[0.9] transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-violet/10" />
          <div className="absolute bottom-4 left-4 font-mono text-[10px] uppercase tracking-widest text-bone/80">
            {profile.name} — {profile.title}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-10">
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-mist">Currently</div>
            <div className="mt-2 text-lg">Software Engineer at Cybage Software</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-mist">Approach</div>
            <div className="mt-2 text-lg">Agile delivery, test-first quality, performance by default</div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-widest text-mist">Toolkit</div>
            <div className="mt-2 text-lg">React · Vue · Angular · .NET Core · Node · AWS</div>
          </div>
        </div>
      </div>
    </section>
  )
}
