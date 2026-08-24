import { brandIcons } from '../data/brandIcons'
import { revealDelay } from '../hooks/useReveal'
import { skillGroups, type Tech } from '../data/site'
import { categoryIcons } from './Icons'
import { SectionHeading } from './SectionHeading'
import { techBadges } from './TechBadges'

/**
 * Brand mark for a chip. Colors come from the generated icon data; the dark
 * variant is only set for marks that would disappear on a dark background.
 */
function TechIcon({ tech }: { tech: Tech }) {
  if (tech.badge) {
    const Badge = techBadges[tech.badge]
    return <Badge className="tech__badge" />
  }

  const icon = tech.slug ? brandIcons[tech.slug] : undefined

  if (!icon) {
    return (
      <span className="tech__glyph" aria-hidden>
        {tech.glyph ?? tech.name.slice(0, 1)}
      </span>
    )
  }

  return (
    <svg
      className="tech__icon"
      viewBox="0 0 24 24"
      aria-hidden
      style={
        {
          '--icon': icon.hex,
          ...(icon.darkHex ? { '--icon-dark': icon.darkHex } : {}),
          ...(icon.lightHex ? { '--icon-light': icon.lightHex } : {}),
        } as React.CSSProperties
      }
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}

export function Skills() {
  return (
    <section className="section skills">
      <div className="container" id="skills">
        <SectionHeading title="Skills" subtitle="The tools, frameworks, and platforms I use to build and ship work" />

        <div className="skills__rows">
          {skillGroups.map((group, index) => {
            const CategoryIcon = categoryIcons[group.icon]

            return (
              <article
                key={group.title}
                className="skill-row card"
                data-reveal
                style={revealDelay(index)}
              >
                <div className="skill-row__head">
                  <span className="skill-row__icon" aria-hidden>
                    <CategoryIcon />
                  </span>
                  <div>
                    <h3 className="skill-row__title">{group.title}</h3>
                    <p className="skill-row__description">{group.description}</p>
                  </div>
                </div>

                <ul className="skill-row__items">
                  {group.items.map((tech) => (
                    <li key={tech.name} className="tech">
                      <TechIcon tech={tech} />
                      <span>{tech.name}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
