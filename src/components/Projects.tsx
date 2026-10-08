import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { gsap, prefersReducedMotion } from '../hooks/motion'
import { projects, type Project } from '../data/resume'
import ProjectArt from './ProjectArt'
import { SectionLabel } from './shared'

function TiltCard({ project, index }: { project: Project; index: number }) {
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 })
  const glareX = useTransform(mx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(my, [0, 1], ['0%', '100%'])
  const glare = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(600px circle at ${x} ${y}, rgba(255,255,255,0.07), transparent 50%)`,
  )

  return (
    <div className="project-card w-full shrink-0 md:w-[min(78vw,1040px)]">
    <motion.article
      data-cursor="View"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width)
        my.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        mx.set(0.5)
        my.set(0.5)
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2 md:flex-row"
    >
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:w-[55%]">
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-out group-hover:scale-110">
          <ProjectArt motif={project.motif} palette={project.palette} />
        </div>
        <div className="absolute left-6 top-6 font-display text-8xl font-extrabold text-white/10">0{index + 1}</div>
        {project.tag && (
          <span className="absolute right-6 top-6 rounded-full border border-white/20 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
            {project.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-7 md:p-10">
        <h3 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{project.title}</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((s) => (
            <span key={s} className="rounded-full px-3 py-1 font-mono text-[11px]" style={{ background: `${project.palette[0]}1f`, color: project.palette[0] }}>
              {s}
            </span>
          ))}
        </div>
        <ul className="mt-6 space-y-3 text-bone/80">
          {project.points.map((p, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2.5 h-1 w-3 shrink-0 rounded-full" style={{ background: project.palette[1] }} />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glare }}
      />
    </motion.article>
    </div>
  )
}

export default function Projects() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 768px)', () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      gsap.to('.reel-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
      })
      // Each card leans in as it crosses the frame.
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.88, opacity: 0.5 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 90%', end: 'left 30%', scrub: true },
          },
        )
      })
    })
    mm.add('(max-width: 767px)', () => {
      gsap.utils.toArray<HTMLElement>('.project-card').forEach((card) => {
        gsap.from(card, { y: 80, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 85%' } })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="projects" ref={root} className="relative overflow-hidden py-24 md:flex md:h-svh md:flex-col md:justify-center md:py-0">
      <div className="mx-auto mb-12 flex w-full max-w-7xl items-end justify-between px-4 md:mb-10 md:px-10">
        <div>
          <SectionLabel index="04">Act II — Selected Work</SectionLabel>
          <h2 className="mt-6 font-display text-5xl font-extrabold tracking-tight md:text-7xl">
            The <span className="text-gradient">reel.</span>
          </h2>
        </div>
        <div className="hidden w-48 md:block">
          <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest text-mist">
            <span>Progress</span>
            <span>0{projects.length}</span>
          </div>
          <div className="h-px bg-white/10">
            <div className="reel-progress h-full origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan" />
          </div>
        </div>
      </div>
      <div ref={track} className="flex flex-col gap-8 px-4 md:w-max md:flex-row md:gap-10 md:px-[10vw]">
        {projects.map((p, i) => (
          <TiltCard key={p.title} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}
