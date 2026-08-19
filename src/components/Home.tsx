import { About } from './About'
import { Contact } from './Contact'
import { Hero } from './Hero'
import { Projects } from './Projects'
import { Skills } from './Skills'
import { WriteupsTeaser } from './WriteupsTeaser'

/** The portfolio itself — everything at `/`. */
export function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <WriteupsTeaser />
      <Contact />
    </main>
  )
}
