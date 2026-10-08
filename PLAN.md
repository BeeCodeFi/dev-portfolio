# Cinematic Portfolio — Build Plan

Source content: `Ayush Kumar – Software Engineer _ Full Stack Developer.pdf`

## 1. Creative direction

- **Mood:** a dark, film-like space. Deep ink background (#07070b), warm off-white type, one electric accent (violet → cyan gradient), film grain, soft glows.
- **Narrative:** the page plays like a film in acts. Preloader (cold open) → Hero (title card) → About (monologue) → Numbers (montage) → Skills (cast) → Experience (act I) → Projects (act II, horizontal reel) → Education (flashback) → Contact (end credits).
- **Motion principles:** every element enters with intent (masked line reveals, staggered letters). Scrolling drives the timeline (scrubbed, never janky). Hover feedback is physical (magnetic buttons, 3D tilt). All motion respects `prefers-reduced-motion`.

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite + React 19 + TypeScript | Fast dev server, typed components |
| Styling | Tailwind CSS v4 | Utility styling, design tokens in CSS |
| Scroll timeline | GSAP + ScrollTrigger | Industry standard for pinned/scrubbed scroll scenes |
| Smooth scroll | Lenis | Inertial scrolling synced to GSAP ticker |
| Micro-interactions | Motion (Framer Motion) | Declarative hover/enter animations, springs |
| 3D / graphics | Three.js via @react-three/fiber + drei | Hero particle-and-shader scene reacting to cursor |
| Content | `src/data/resume.ts` | Single typed source of truth taken from the PDF |

## 3. Skills required

**Core web**
- Modern JavaScript/TypeScript, React (hooks, refs, effects, context)
- CSS layout (grid/flex), transforms, `clip-path`, blend modes, custom properties
- Responsive and mobile-first design; accessibility (semantic HTML, focus states, reduced motion)

**Motion and animation**
- GSAP timelines, easing, staggering; ScrollTrigger pinning, scrubbing, horizontal-scroll sections
- Smooth-scroll integration (Lenis ↔ ScrollTrigger sync)
- Spring physics and gesture feedback (Motion)
- Text-splitting techniques for letter/word/line reveals

**3D and creative coding**
- Three.js fundamentals: scene, camera, geometry, materials, buffers
- GLSL shaders (vertex displacement with noise, fragment gradients)
- React Three Fiber render loop (`useFrame`), performance budgets (DPR clamp, instancing)

**Design**
- Typography pairing and scale, cinematic composition, colour grading in UI
- Storyboarding scroll sequences

**Engineering**
- Performance: GPU-friendly properties (transform/opacity), lazy-loading heavy 3D, Lighthouse audits
- Deployment: static hosting (Vercel / Netlify / AWS S3 + CloudFront, which matches the resume)

## 4. Site map and scenes

| # | Section | Content source | Signature effect |
|---|---|---|---|
| 0 | Preloader | Name | 0→100 counter, curtain wipe out |
| 1 | Hero | Name, title, links | Shader-displaced 3D orb + particle field following the cursor; split-letter name reveal; rotating role ticker |
| 2 | About | Professional summary | Scroll-scrubbed word-by-word light-up |
| 3 | Numbers | 2+ yrs, 95% coverage, 15% faster, 3+ teams | Count-up on enter, glowing cards |
| 4 | Skills | 7 skill categories | Dual-direction infinite marquee + category grid with magnetic chips |
| 5 | Experience | Cybage, 8 bullets | Pinned panel; timeline progress line draws as you scroll; bullets cascade in |
| 6 | Projects | 3 projects | Pinned horizontal reel; 3D tilt cards with generated SVG/gradient art per project |
| 7 | Education | KIIT B.Tech | Parallax card |
| 8 | Contact | Email, phone, LinkedIn, GitHub | Giant marquee CTA, magnetic button, footer |

**Global layers:** custom blended cursor, film-grain overlay, vignette, scroll-progress bar, fixed nav with section links.

## 5. Build phases

1. **Foundation:** scaffold Vite/React/TS, Tailwind tokens, fonts, resume data file. ✅
2. **Global systems:** Lenis + GSAP sync, cursor, grain, nav, preloader. ✅
3. **Hero 3D scene:** R3F canvas, noise-shader orb, particles, mouse parallax. ✅
4. **Scroll scenes:** About, Numbers, Skills, Experience, Projects, Education, Contact. ✅
5. **Polish:** reduced motion, mobile layouts, performance (lazy 3D, DPR clamp). ✅
6. **Next steps (yours):** add real project screenshots/links, a profile photo, an OG image and favicon; deploy.

## 6. Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```
