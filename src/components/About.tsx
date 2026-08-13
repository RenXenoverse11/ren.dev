import { about, site } from '../data/site'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeading title={about.heading} subtitle={about.subheading} />

        <div className="about__body">
          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="about__paragraph">
              {paragraph}
            </p>
          ))}

          <div className="about__actions">
            <a className="button button--primary" href="#contact">
              Let's Work Together
            </a>
            <a className="button button--ghost" href={site.resume} download>
              Download CV
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
