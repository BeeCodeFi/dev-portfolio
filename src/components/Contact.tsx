import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion, scrollToTarget, isIOS } from '../hooks/motion'
import { profile } from '../data/resume'
import { useScramble } from './shared'

const socials = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'Phone', href: `tel:${profile.phone.replace(/-/g, '')}` },
]

export default function Contact() {
  const root = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [sent, setSent] = useState(false)
  useScramble("Let's Connect", titleRef)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const items = root.current?.querySelectorAll('.cta-social, .cta-footer')
    if (items) gsap.set(items, { y: 30, opacity: 0, force3D: !isIOS() })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const force3D = !isIOS()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-row',
        { xPercent: (i) => (i % 2 ? -8 : 5) },
        {
          xPercent: (i) => (i % 2 ? 5 : -8),
          ease: 'none',
          force3D,
          scrollTrigger: { 
            trigger: root.current, 
            start: 'top bottom', 
            end: 'bottom top', 
            scrub: isIOS() ? 0.5 : true,
          },
        },
      )
      gsap.from('.cta-orb', {
        scale: 0, duration: 1.6, ease: 'elastic.out(1, 0.45)', immediateRender: false,
        force3D,
        scrollTrigger: { trigger: '.cta-orb', start: 'top 85%' },
      })
      gsap.to('.cta-social', {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.9, ease: 'power3.out',
        force3D,
        scrollTrigger: { trigger: '.cta-socials', start: 'top 85%', toggleActions: 'play none none none' },
      })
      gsap.to('.cta-footer', {
        opacity: 1, y: 0, duration: 1, ease: 'power2.out',
        force3D,
        scrollTrigger: { trigger: '.cta-footer', start: 'top 95%', toggleActions: 'play none none none' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    
    // Format message for WhatsApp
    const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Email:* ${encodeURIComponent(email)}%0A*Subject:* ${encodeURIComponent(subject)}%0A%0A*Message:*%0A${encodeURIComponent(message)}`
    
    // WhatsApp number (remove any spaces, dashes, or special characters)
    const whatsappNumber = '917004900272' // Country code + your number
    
    // Open WhatsApp with pre-filled message
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`
    window.open(whatsappURL, '_blank')
    
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <section id="contact" ref={root} className="relative overflow-x-hidden pt-32 md:pt-40">
      {/* Ambient radials */}


      {/* Big scrolling CTA text */}
      <div className="my-16 select-none font-display font-extrabold leading-[0.88] tracking-tight text-[15vw] md:my-20 md:text-[10vw]">
        <div className="cta-row whitespace-nowrap">
          Let's build <span className="text-gradient">something</span>
        </div>
        <div className="cta-row whitespace-nowrap pl-[10vw] outline-text">cinematic together —</div>
      </div>

      {/* Contact form + info grid — from template */}
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="grid items-start gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="shimmer-border flex flex-col gap-6 rounded-3xl border border-white/10 bg-ink-2 p-8"
          >
            <h3 className="font-display text-2xl font-bold">Send a message</h3>

            {/* Name */}
            <div className="relative">
              <input
                type="text" id="cf-name" name="name" required placeholder=" "
                className="peer w-full border-b border-white/15 bg-transparent pb-3 pt-5 text-bone outline-none transition-colors focus:border-violet"
              />
              <label htmlFor="cf-name" className="pointer-events-none absolute left-0 top-5 text-sm text-mist transition-all duration-300 peer-focus:-top-0.5 peer-focus:text-xs peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-xs">
                Your name
              </label>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-400 peer-focus:w-full" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email" id="cf-email" name="email" required placeholder=" "
                className="peer w-full border-b border-white/15 bg-transparent pb-3 pt-5 text-bone outline-none transition-colors focus:border-violet"
              />
              <label htmlFor="cf-email" className="pointer-events-none absolute left-0 top-5 text-sm text-mist transition-all duration-300 peer-focus:-top-0.5 peer-focus:text-xs peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-xs">
                Email address
              </label>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-400 peer-focus:w-full" />
            </div>

            {/* Subject */}
            <div className="relative">
              <input
                type="text" id="cf-subject" name="subject" required placeholder=" "
                className="peer w-full border-b border-white/15 bg-transparent pb-3 pt-5 text-bone outline-none transition-colors focus:border-violet"
              />
              <label htmlFor="cf-subject" className="pointer-events-none absolute left-0 top-5 text-sm text-mist transition-all duration-300 peer-focus:-top-0.5 peer-focus:text-xs peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-xs">
                Subject
              </label>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-400 peer-focus:w-full" />
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                id="cf-message" name="message" rows={4} required placeholder=" "
                className="peer w-full resize-none border-b border-white/15 bg-transparent pb-3 pt-5 text-bone outline-none transition-colors focus:border-violet"
              />
              <label htmlFor="cf-message" className="pointer-events-none absolute left-0 top-5 text-sm text-mist transition-all duration-300 peer-focus:-top-0.5 peer-focus:text-xs peer-focus:text-cyan peer-[:not(:placeholder-shown)]:-top-0.5 peer-[:not(:placeholder-shown)]:text-xs">
                Your message
              </label>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gradient-to-r from-violet to-cyan transition-all duration-400 peer-focus:w-full" />
            </div>

            <button
              type="submit"
              className="mt-2 flex items-center gap-3 self-start rounded-full bg-gradient-to-r from-violet to-cyan px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]"
            >
              <span>{sent ? 'Sent! 🎉' : 'Send Message'}</span>
              {!sent && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </form>

          {/* Info panel */}
          <div className="flex flex-col gap-4">

            {/* Intro blurb */}
            <div className="shimmer-border rounded-3xl border border-white/10 bg-ink-2 p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-cyan/80">// Let's talk</p>
              <p className="mt-3 text-base leading-relaxed text-bone/80">
                Have a project in mind, a role to discuss, or just want to say hi? I'm always open to the right conversation.
              </p>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-2.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-sm text-emerald-400/90 font-medium">Available for new opportunities</span>
              </div>
            </div>

            {/* Contact details */}
            <div className="flex flex-col gap-3">
              {[
                { icon: '✉', label: profile.email, href: `mailto:${profile.email}` },
                { icon: '📞', label: profile.phone, href: `tel:${profile.phone.replace(/-/g, '')}` },
                { icon: '📍', label: 'Pune, India · IST (UTC +5:30)', href: null },
              ].map((item) => (
                <div key={item.label} className="shimmer-border flex items-center gap-4 rounded-2xl border border-white/10 bg-ink-2 px-5 py-3.5 transition-all duration-300 hover:border-violet/30">
                  <span className="text-lg shrink-0">{item.icon}</span>
                  {item.href
                    ? <a href={item.href} className="text-sm text-bone/80 transition-colors hover:text-cyan truncate">{item.label}</a>
                    : <span className="text-sm text-bone/80">{item.label}</span>
                  }
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="cta-socials grid grid-cols-2 gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="cta-social shimmer-border group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-ink-2 px-5 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/40 hover:bg-violet/5 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
                >
                  <span className="text-sm text-bone/80 transition-colors group-hover:text-bone">{s.label}</span>
                  <span className="text-mist transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="cta-footer mx-auto mt-24 flex max-w-7xl flex-col gap-4 border-t border-white/8 px-4 py-8 font-mono text-xs text-mist md:flex-row md:items-center md:justify-between md:px-10">
        <span>© {new Date().getFullYear()} {profile.name}. Directed &amp; developed by me.</span>
        <span>{profile.phone}</span>
        <button
          onClick={() => scrollToTarget('#top')}
          className="group text-left uppercase tracking-widest transition-colors hover:text-bone"
        >
          Back to top
          <span className="ml-1 inline-block transition-transform duration-300 group-hover:-translate-y-1">↑</span>
        </button>
      </footer>
    </section>
  )
}
