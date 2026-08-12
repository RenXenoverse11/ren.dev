import { skillGroups } from '../data/site'
import { SectionHeading } from './SectionHeading'

export function Skills() {
  return (
    <section className="section skills" id="skills">
      <div className="container">
        <SectionHeading title="Skills" subtitle="Technologies I work with every day" />

        <div className="skills__grid">
          {skillGroups.map((group) => (
            <article key={group.title} className="skill-card card">
              <div className="skill-card__head">
                <span className="skill-card__icon" aria-hidden>
                  {group.icon}
                </span>
                <h3 className="skill-card__title">{group.title}</h3>
              </div>

              <ul className="skill-card__list">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="skill">
                    <div className="skill__row">
                      <span className="skill__name">{skill.name}</span>
                      <span className="skill__level">{skill.level}%</span>
                    </div>
                    <div
                      className="skill__track"
                      role="progressbar"
                      aria-label={skill.name}
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <span className="skill__bar" style={{ width: `${skill.level}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
