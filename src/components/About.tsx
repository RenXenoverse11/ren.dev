import { about, site } from '../data/site'
import { CheckIcon, MapPinIcon } from './Icons'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <SectionHeading title={about.heading} subtitle={about.subheading} />

        <div className="about__grid">
          <div className="about__card card">
            <div className="about__badge">
              <MapPinIcon />
              <span>{site.location}</span>
            </div>
            <h3 className="about__name">{site.name}</h3>
            <p className="about__role">{site.role}</p>
            <ul className="about__highlights">
              {about.highlights.map((item) => (
                <li key={item}>
                  <CheckIcon className="about__check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about__body">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="about__paragraph">
                {paragraph}
              </p>
            ))}

            <div className="about__stats">
              {about.stats.map((stat) => (
                <div key={stat.label} className="stat card">
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                </div>
              ))}
            </div>

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
      </div>
    </section>
  )
}
