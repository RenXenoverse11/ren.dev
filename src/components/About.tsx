import { about } from '../data/site'
import { GraduationCapIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeading title={about.heading} subtitle={about.subheading} />

        <div className="about__body">
          <p className="about__lead">{about.lead}</p>

          {about.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)} className="about__paragraph">
              {paragraph}
            </p>
          ))}

          <p className="about__education">
            <GraduationCapIcon className="about__education-icon" />
            <span>
              <strong>{about.education.degree}</strong>, {about.education.school}
              {about.education.year ? `, ${about.education.year}` : ''}
            </span>
          </p>
        </div>

        <div className="about__actions">
          <a className="button button--primary" href="#contact">
            Let's Work Together
          </a>
        </div>
      </div>
    </section>
  )
}
