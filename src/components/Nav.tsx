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
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.set(bar.current, { scaleX: self.progress })
        setScrolled(self.progress > 0.02)
      },
    })
    // Track active section
    const sections = links.map((l) => document.querySelector(l.href))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection('#' + e.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    sections.forEach((s) => s && obs.observe(s))
    return () => { st.kill(); obs.disconnect() }
  }, [])

  useEffect(() => {
    if (visible) {
      gsap.fromTo(
        nav.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, delay: 0.6, ease: 'expo.out' },
      )
    }
  }, [visible])

  const go = (href: string) => {
    setOpen(false)
    scrollToTarget(href)
  }

  return (
    <>
      {/* Scroll progress bar */}
      <div ref={bar} className="fixed left-0 top-0 z-[70] h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-violet via-cyan to-violet" />

      <header
        ref={nav}
        className={`fixed inset-x-0 top-0 z-50 opacity-0 transition-all duration-500 ${scrolled ? 'bg-ink/80 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]' : 'bg-gradient-to-b from-ink/70 via-ink/30 to-transparent backdrop-blur-none'
          }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-10">
          {/* Logo */}
          <button
            onClick={() => go('#top')}
            className="group font-display text-lg font-bold tracking-tight transition-all duration-300"
          >
            <span className="transition-colors group-hover:text-bone/70">AK</span>
            <span className="text-gradient">.</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-1.5 backdrop-blur-md md:flex">
            {links.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className={`relative rounded-full px-4 py-1.5 text-sm transition-all duration-300 ${activeSection === l.href
                    ? 'bg-white/10 text-bone'
                    : 'text-bone/60 hover:bg-white/8 hover:text-bone'
                  }`}
              >
                {activeSection === l.href && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet/20 to-cyan/10" />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </nav>

          {/* Available indicator */}
          <a
            href={`mailto:${profile.email}`}
            className="group hidden items-center gap-2 text-sm text-bone/60 transition-colors hover:text-bone md:flex"
          >
            <span>Available for work</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
          </a>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden font-mono text-xs uppercase tracking-widest transition-colors hover:text-bone"
            aria-expanded={open}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Mobile drawer */}
        {open && (
          <nav className="mx-4 mb-4 flex flex-col gap-1 rounded-2xl border border-white/10 bg-ink-2/95 p-4 backdrop-blur-xl md:hidden">
            {links.map((l, i) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="rounded-xl py-3 text-left font-display text-2xl font-bold transition-colors hover:text-gradient"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                {l.label}
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
