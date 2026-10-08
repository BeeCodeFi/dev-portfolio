import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { experience } from '../data/resume'
import { RevealHeading, SectionLabel } from './shared'

export default function Experience() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-progress',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.exp-list', start: 'top 60%', end: 'bottom 60%', scrub: true } },
      )
      gsap.utils.toArray<HTMLElement>('.exp-item').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0.15, x: 40 },
          {
            opacity: 1,
            x: 0,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 55%', scrub: true },
          },
        )
        gsap.fromTo(
          el.querySelector('.exp-dot'),
          { scale: 0, backgroundColor: '#8a8796' },
          {
            scale: 1,
            backgroundColor: '#22d3ee',
            scrollTrigger: { trigger: el, start: 'top 60%', toggleActions: 'play none none reverse' },
            duration: 0.4,
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="experience" ref={root} className="relative mx-auto max-w-7xl px-4 py-32 md:px-10 md:py-40">
      <SectionLabel index="03">Act I — Experience</SectionLabel>
      <RevealHeading lines={['Where the work', <span className="outline-text">gets real.</span>]} className="mt-8 text-5xl md:text-8xl" />

      {experience.map((job) => (
        <div key={job.company} className="mt-20 grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="md:sticky md:top-32 md:self-start">
            <div className="font-mono text-xs uppercase tracking-widest text-cyan">{job.period}</div>
            <h3 className="mt-4 font-display text-4xl font-extrabold md:text-6xl">{job.company}</h3>
            <div className="mt-3 text-xl text-bone/80">{job.role}</div>
            <div className="text-mist">{job.division}</div>
            <div className="mt-8 hidden aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 bg-ink-2 md:block">
              <CodeReel />
            </div>
          </div>

          <ol className="exp-list relative space-y-10 pl-8">
            <span className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10" />
            <span className="exp-progress absolute left-[5px] top-2 bottom-2 w-px origin-top bg-gradient-to-b from-violet to-cyan" />
            {job.points.map((p, i) => (
              <li key={i} className="exp-item relative">
                <span className="exp-dot absolute -left-8 top-2 h-[11px] w-[11px] rounded-full ring-4 ring-ink" />
                <span className="font-mono text-xs text-mist">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-1 text-lg leading-relaxed text-bone/90 md:text-xl">{p}</p>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  )
}

/** A faux editor that types out code on loop — atmosphere for the sticky column. */
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
