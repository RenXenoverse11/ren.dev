/**
 * Single source of truth for every piece of content on the site.
 * Edit this file to update the portfolio — no component changes needed.
 */

export type Skill = {
  name: string
  level: number // 0-100, drives the progress bar width
}

export type SkillGroup = {
  title: string
  icon: string
  skills: Skill[]
}

export type Project = {
  title: string
  description: string
  tags: string[]
  demo?: string
  repo?: string
  /** Emoji or short text used as the card's cover graphic. */
  cover: string
}

export type SocialLink = {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'facebook' | 'mail'
}

export const site = {
  /** Wordmark next to the logo. Split on the last dot: name, accent dot, suffix. */
  brand: 'renxen.dev',
  /** Show the wordmark text beside the mark. Set false to use the mark alone. */
  showWordmark: true,
  name: 'Laurence Jan Bagaan',
  greeting: "Hello, I am",
  role: 'Full Stack Web and Mobile Developer',
  tagline:
    'Building exceptional digital experiences with modern technologies and creative solutions.',
  /**
   * Hero photo, served from `public/`. If the file is missing, the hero falls
   * back to your initials instead of a broken image.
   */
  photo: '/laurence.jpg',
  resume: '/resume.pdf',
  location: 'Philippines',
  email: 'laurencejan1431@gmail.com',
  phone: '',
}

export const about = {
  heading: 'About Me',
  subheading: 'Get to know me a little better',
  paragraphs: [
    "I'm a full stack developer who enjoys turning ideas into products people actually like using. I work across the stack — from designing clean, responsive interfaces to building the APIs and data models that power them.",
    'On the web I reach for React and TypeScript on the front end, with Node.js and PostgreSQL behind it. For mobile I build cross-platform apps with React Native and Flutter, so a single codebase ships to both Android and iOS.',
    "I care about details: fast load times, accessible markup, and code that the next developer can read. When I'm not shipping, I'm usually learning something new or refactoring something old.",
  ],
  stats: [
    { value: '3+', label: 'Years Experience' },
    { value: '20+', label: 'Projects Built' },
    { value: '15+', label: 'Happy Clients' },
  ],
  highlights: [
    'Clean, maintainable, well-typed code',
    'Responsive and accessible interfaces',
    'REST & GraphQL API development',
    'Cross-platform mobile apps',
  ],
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    icon: '🎨',
    skills: [
      { name: 'React / Next.js', level: 92 },
      { name: 'TypeScript', level: 88 },
      { name: 'HTML5 & CSS3', level: 95 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: [
      { name: 'Node.js / Express', level: 88 },
      { name: 'PHP / Laravel', level: 80 },
      { name: 'PostgreSQL / MySQL', level: 85 },
      { name: 'REST & GraphQL APIs', level: 86 },
    ],
  },
  {
    title: 'Mobile',
    icon: '📱',
    skills: [
      { name: 'React Native', level: 87 },
      { name: 'Flutter / Dart', level: 78 },
      { name: 'Firebase', level: 84 },
      { name: 'App Store Deployment', level: 75 },
    ],
  },
  {
    title: 'Tools',
    icon: '🧰',
    skills: [
      { name: 'Git & GitHub', level: 93 },
      { name: 'Docker', level: 72 },
      { name: 'Figma', level: 80 },
      { name: 'Vite / Webpack', level: 82 },
    ],
  },
]

export const projects: Project[] = [
  {
    title: 'ShopFlow — E-Commerce Platform',
    description:
      'A full featured storefront with product search, cart, Stripe checkout, and an admin dashboard for inventory and orders.',
    tags: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    cover: '🛒',
    demo: '#',
    repo: '#',
  },
  {
    title: 'TaskMate — Team Task Manager',
    description:
      'Real-time collaborative task board with drag-and-drop columns, comments, and role-based permissions for small teams.',
    tags: ['React', 'Node.js', 'Socket.IO', 'MongoDB'],
    cover: '✅',
    demo: '#',
    repo: '#',
  },
  {
    title: 'FitTrack — Fitness Mobile App',
    description:
      'Cross-platform workout tracker with offline-first sync, progress charts, and push reminders to keep streaks alive.',
    tags: ['React Native', 'Expo', 'Firebase'],
    cover: '💪',
    demo: '#',
    repo: '#',
  },
  {
    title: 'CampusHub — School Portal',
    description:
      'Student portal for enrollment, grades, and announcements, with a Laravel API and a role-aware React front end.',
    tags: ['Laravel', 'React', 'MySQL'],
    cover: '🎓',
    demo: '#',
    repo: '#',
  },
  {
    title: 'DevBlog — Headless CMS Blog',
    description:
      'Statically generated blog with MDX content, full-text search, reading time estimates, and a perfect Lighthouse score.',
    tags: ['Next.js', 'MDX', 'Vercel'],
    cover: '📝',
    demo: '#',
    repo: '#',
  },
  {
    title: 'WeatherNow — Forecast Dashboard',
    description:
      'Clean weather dashboard with location search, hourly and 7-day forecasts, and animated condition backgrounds.',
    tags: ['React', 'TypeScript', 'OpenWeather API'],
    cover: '🌤️',
    demo: '#',
    repo: '#',
  },
]

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/RenXenoverse11', icon: 'github' },
  { label: 'LinkedIn', href: '#', icon: 'linkedin' },
  { label: 'Facebook', href: '#', icon: 'facebook' },
  { label: 'Email', href: `mailto:${site.email}`, icon: 'mail' },
]

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

/**
 * Where the contact form posts.
 * Leave empty to fall back to opening the visitor's mail client (mailto).
 * To use Formspree instead, set this to your endpoint, e.g.
 * 'https://formspree.io/f/xxxxxxxx'
 */
export const contactEndpoint = ''
