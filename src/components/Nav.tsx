import { useEffect, useRef, useState } from 'react'
import { gsap, scrollToTarget, ScrollTrigger } from '../hooks/motion'
import { profile } from '../data/resume'

const links = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Work' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Nav({ visible }: { visible: boolean }) {
  const bar = useRef<HTMLDivElement>(null)
  const nav = useRef<HTMLElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    if (visible) gsap.fromTo(nav.current, { yPercent: -100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1, delay: 0.6, ease: 'expo.out' })
  }, [visible])

  const go = (href: string) => {
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      <div ref={bar} className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan" />
      <header ref={nav} className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-ink/90 via-ink/50 to-transparent opacity-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-10">
          <button onClick={() => go('#top')} className="font-display text-lg font-bold tracking-tight">
            AK<span className="text-gradient">.</span>
          </button>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-ink/50 px-2 py-1.5 backdrop-blur-md md:flex">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-full px-4 py-1.5 text-sm text-bone/70 transition hover:bg-white/10 hover:text-bone"
              >
                {l.label}
              </button>
            ))}
          </nav>
          <a href={`mailto:${profile.email}`} className="hidden text-sm text-bone/70 transition hover:text-bone md:block">
            Available for work <span className="ml-1 inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          </a>
          <button onClick={() => setOpen(!open)} className="md:hidden font-mono text-xs uppercase tracking-widest" aria-expanded={open}>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
        {open && (
          <nav className="mx-4 flex flex-col rounded-2xl border border-white/10 bg-ink-2/95 p-4 backdrop-blur-md md:hidden">
            {links.map((l) => (
              <button key={l.href} onClick={() => go(l.href)} className="py-3 text-left font-display text-2xl font-bold">
                {l.label}
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
