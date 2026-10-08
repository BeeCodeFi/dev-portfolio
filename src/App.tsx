import { useCallback, useEffect, useState } from 'react'
import { useSmoothScroll, ScrollTrigger } from './hooks/motion'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const onLoaded = useCallback(() => setLoaded(true), [])
  useSmoothScroll(loaded)

  useEffect(() => {
    document.documentElement.style.overflow = loaded ? '' : 'hidden'
    if (loaded) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [loaded])

  return (
    <>
      {!loaded && <Preloader onDone={onLoaded} />}
      <Cursor />
      <Nav visible={loaded} />
      <main>
        <Hero start={loaded} />
        <About />
        <Stats />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Contact />
      </main>
      <div className="vignette" aria-hidden />
      <div className="grain" aria-hidden />
    </>
  )
}
