import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { experience } from '../data/resume'
import { SectionLabel, useScramble } from './shared'

export default function Experience() {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  useScramble('Where the work gets real.', titleRef)

  // Pre-hide items before first paint
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const items = root.current?.querySelectorAll('.exp-item')
    if (items) gsap.set(items, { opacity: 0, x: 50 })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-progress',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.exp-list', start: 'top 60%', end: 'bottom 60%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.exp-item').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          x: 0,
          ease: 'power3.out',
          duration: 1,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
        gsap.fromTo(
          el.querySelector('.exp-dot'),
          { scale: 0, backgroundColor: '#8a8796' },
          {
            scale: 1,
            backgroundColor: '#22d3ee',
            boxShadow: '0 0 14px rgba(34,211,238,0.7)',
            scrollTrigger: { trigger: el, start: 'top 65%', toggleActions: 'play none none reverse' },
            duration: 0.5,
            ease: 'back.out(3)',
          },
        )
      })
      gsap.to('.exp-sticky-col', {
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: '.exp-grid', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={root} className="relative mx-auto max-w-7xl px-4 py-32 md:px-10 md:py-40">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute right-0 top-1/3 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-cyan/5 blur-[160px]" />

      <div className="mb-4 flex items-center gap-6">
        <SectionLabel index="03">Experience</SectionLabel>

      </div>
      <h2 ref={titleRef} className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-8xl">
        Where the work <span className="outline-text">gets real.</span>
      </h2>

      {experience.map((job) => (
        <div key={job.company} className="exp-grid mt-20 grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          {/* Sticky left column */}
          <div className="exp-sticky-col md:sticky md:top-32 md:self-start">
            <div className="font-mono text-xs uppercase tracking-widest text-cyan">{job.period}</div>
            <h3 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">{job.company}</h3>
            <div className="mt-3 text-xl text-bone/80">{job.role}</div>
            <div className="text-mist">{job.division}</div>
            <div className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-ink-2 md:block">
              <CodeReel />
            </div>
          </div>

          {/* Timeline list */}
          <ol className="exp-list relative space-y-10 pl-8">
            <span className="absolute left-[5px] top-2 bottom-2 w-px bg-white/8" />
            <span className="exp-progress absolute left-[5px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-violet via-cyan to-violet" />
            {job.points.map((p, i) => (
              <li key={i} className="exp-item group relative">
                <span className="exp-dot absolute -left-8 top-2 h-[11px] w-[11px] rounded-full ring-4 ring-ink transition-all duration-300" />
                <span className="font-mono text-xs text-mist">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 text-lg leading-relaxed text-bone/80 transition-colors duration-300 group-hover:text-bone md:text-xl">
                  {p}
                </p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}

/** Faux editor that types out code on loop */
function CodeReel() {
  const lines = [
    ['const', ' library ', '=', ' createComponents', '({'],
    ['  teams', ': ', '3', ','],
    ['  effortSaved', ': ', "'15%'", ','],
    ['  coverage', ': ', "'95%'", ','],
    ['})'],
    [''],
    ['await', ' api', '.', 'connect', "('/microservices')"],
    ['deploy', '(', "'aws'", ', { ', 'stable', ': ', 'true', ' })'],
  ]
  const colors = ['text-violet', 'text-bone', 'text-cyan', 'text-amber-300', 'text-bone/70']
  return (
    <div className="flex h-full flex-col p-6 font-mono text-sm">
      <div className="mb-5 flex gap-2">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-300/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
      </div>
      {lines.map((l, i) => (
        <div
          key={i}
          className="overflow-hidden whitespace-nowrap leading-7"
          style={{ animation: `typeline 8s ${i * 0.45}s steps(30) infinite`, width: 0 }}
        >
          <span className="mr-4 text-mist/50">{i + 1}</span>
          {l.map((t, j) => (
            <span key={j} className={colors[j % colors.length]}>
              {t}
            </span>
          ))}
        </div>
      ))}
      <style>{`@keyframes typeline{0%{width:0}15%,85%{width:100%}100%{width:0}}`}</style>
    </div>
  )
}
