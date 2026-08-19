import { About } from './About'
import { BlogTeaser } from './BlogTeaser'
import { Contact } from './Contact'
import { Hero } from './Hero'
import { Projects } from './Projects'
import { Skills } from './Skills'

/** The portfolio itself — everything at `/`. */
export function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <BlogTeaser />
      <Contact />
    </main>
  )
}
