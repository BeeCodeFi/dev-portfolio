import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, scrollToTarget } from '../hooks/motion'
import { profile } from '../data/resume'
import { Magnetic, SectionLabel } from './shared'

const socials = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'Phone', href: `tel:${profile.phone.replace(/-/g, '')}` },
]

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-row',
        { xPercent: (i) => (i % 2 ? -20 : 0) },
        { xPercent: (i) => (i % 2 ? 0 : -20), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.from('.cta-orb', { scale: 0, duration: 1.4, ease: 'elastic.out(1, 0.5)', scrollTrigger: { trigger: '.cta-orb', start: 'top 85%' } })
    }, root)
    return () => ctx.revert()
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section id="contact" ref={root} className="relative overflow-hidden pt-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <SectionLabel index="06">End Credits</SectionLabel>
      </div>

      <div className="my-16 select-none font-display font-extrabold leading-[0.9] tracking-tight text-[15vw] md:my-20 md:text-[10vw]">
        <div className="cta-row whitespace-nowrap">Let's build <span className="text-gradient">something</span></div>
        <div className="cta-row whitespace-nowrap pl-[10vw] outline-text">cinematic together —</div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-start gap-12 px-4 md:flex-row md:items-center md:justify-between md:px-10">
        <Magnetic strength={0.5}>
          <button
            onClick={copy}
            data-cursor={copied ? 'Copied' : 'Copy'}
            className="cta-orb flex h-44 w-44 flex-col items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan text-center font-semibold text-ink shadow-[0_0_80px_rgba(139,92,246,0.45)] md:h-56 md:w-56"
          >
            <span className="font-display text-xl md:text-2xl">{copied ? 'Copied!' : 'Say hello'}</span>
            <span className="mt-1 font-mono text-[10px] opacity-70">{profile.email}</span>
          </button>
        </Magnetic>
        <ul className="grid w-full grid-cols-2 gap-3 md:w-auto md:grid-cols-4">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group flex items-center justify-between gap-6 rounded-2xl border border-white/10 px-5 py-4 transition hover:border-white/40 hover:bg-white/[0.04]"
              >
                <span>{s.label}</span>
                <span className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="mx-auto mt-32 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-4 py-8 font-mono text-xs text-mist md:flex-row md:items-center md:justify-between md:px-10">
        <span>© {new Date().getFullYear()} {profile.name}. Directed &amp; developed by me.</span>
        <span>{profile.phone}</span>
        <button onClick={() => scrollToTarget('#top')} className="text-left uppercase tracking-widest hover:text-bone">
          Back to top ↑
        </button>
      </footer>
    </section>
  )
}
