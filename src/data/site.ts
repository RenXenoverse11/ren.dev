/**
 * Single source of truth for every piece of content on the site.
 * Edit this file to update the portfolio — no component changes needed.
 */

export type Tech = {
  name: string
  /** Key into `brandIcons`. Omit when the tool has no brand mark. */
  slug?: string
  /** Shown in place of a missing brand mark. */
  glyph?: string
}

export type SkillGroup = {
  title: string
  description: string
  icon: 'window' | 'database' | 'terminal' | 'phone'
  items: Tech[]
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
  icon: 'github' | 'linkedin' | 'facebook' | 'upwork' | 'mail'
}

export const site = {
  /** Wordmark next to the logo. Split on the last dot: name, accent dot, suffix. */
  brand: 'renxen.dev',
  /** Show the wordmark text beside the mark. Set false to use the mark alone. */
  showWordmark: true,
  name: 'Laurence Jan Bagaan',
  greeting: "Hello, I am",
  role: 'Full-Stack Web and Mobile Developer',
  tagline:
    'Building responsive web and mobile experiences with clean design, modern technology, and reliable engineering.',
  /**
   * Hero photo, served from `public/`. If the file is missing, the hero falls
   * back to your initials instead of a broken image.
   */
  photo: '/laurence.jpg',
  /** Served from `public/`. The filename is what lands in the visitor's downloads. */
  resume: '/LAURENCE-BAGAAN_RESUME.pdf',
  location: 'Davao City, Philippines',
  email: 'laurencejan1431@gmail.com',
  phone: '',
}

export const about = {
  heading: 'About Me',
  subheading: 'Building digital products from idea to reality',
  /** Opening statement, set larger than the paragraphs that follow. */
  lead: "I'm a full-stack developer who enjoys turning ideas into practical digital products. I work across both design and development — from creating intuitive user interfaces in Figma to building the frontend, backend, APIs, and databases that power them.",
  paragraphs: [
    'My experience includes developing responsive web applications, cross-platform mobile apps, and scalable backend systems. I focus on creating products that are fast, accessible, maintainable, and enjoyable to use.',
    "I'm constantly learning new technologies, improving my craft, and looking for opportunities to build meaningful products that solve real problems.",
  ],
  /** Shown as a credential line under the bio. Set `year` to '' to hide it. */
  education: {
    degree: 'BS Computer Engineering',
    school: 'University of Mindanao',
    year: '',
  },
  /** Pulled out of the prose into its own card beside the bio. */
  featured: {
    label: 'Featured project',
    /**
     * Logo served from `public/`. Falls back to the emoji below if the file
     * is missing, so the card never shows a broken image.
     */
    logo: '/mindaride.png',
    icon: '🚍',
    title: 'MindaRide',
    body: "A transportation platform I designed and developed to help commuters in Mindanao search routes, check fares, and plan their trips more efficiently. It's the project I'm most proud of.",
  },
}

export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    description: 'Building interactive and responsive UI.',
    icon: 'window',
    items: [
      { name: 'React 19', slug: 'react' },
      { name: 'TypeScript', slug: 'typescript' },
      { name: 'Svelte 5', slug: 'svelte' },
      { name: 'Angular', slug: 'angular' },
      { name: 'Vue.js', slug: 'vuedotjs' },
      { name: 'jQuery', slug: 'jquery' },
      { name: 'Tailwind CSS', slug: 'tailwindcss' },
      { name: 'Three.js', slug: 'threedotjs' },
      { name: 'Framer Motion', slug: 'framer' },
    ],
  },
  {
    title: 'Backend & Data',
    description: 'APIs, databases, and serverless platforms.',
    icon: 'database',
    items: [
      { name: 'Node.js', slug: 'nodedotjs' },
      { name: 'Laravel', slug: 'laravel' },
      { name: 'Supabase', slug: 'supabase' },
      { name: 'PostgreSQL', slug: 'postgresql' },
      { name: 'Google Apps Script', slug: 'googleappsscript' },
      { name: 'Google Sheets API', slug: 'googlesheets' },
      { name: 'REST APIs', glyph: '{}' },
    ],
  },
  {
    title: 'Tools & Infra',
    description: 'Developer tools and cloud infrastructure.',
    icon: 'terminal',
    items: [
      { name: 'Vite', slug: 'vite' },
      { name: 'Git', slug: 'git' },
      { name: 'GitHub', slug: 'github' },
      { name: 'Vercel', slug: 'vercel' },
      { name: 'Cloudflare', slug: 'cloudflare' },
      { name: 'OSRM', glyph: 'O' },
      { name: 'Mapbox', slug: 'mapbox' },
      { name: 'Leaflet', slug: 'leaflet' },
    ],
  },
  {
    title: 'Mobile',
    description: 'Cross-platform and native development.',
    icon: 'phone',
    items: [
      { name: 'React Native', slug: 'react' },
      { name: 'Flutter', slug: 'flutter' },
      { name: 'Dart', slug: 'dart' },
      { name: 'Android Studio', slug: 'androidstudio' },
    ],
  },
]

export const projects: Project[] = [
  {
    title: 'MindaRide',
    description:
      'A bus schedule and fare finder for Mindanao. Riders compare fares, schedules, operators, and travel times across overland routes on a live map, switch between regular and student/PWD/senior fares, and ask an in-app assistant questions in Tagalog, Bisaya, or English.',
    tags: ['React 19', 'TanStack Start', 'TypeScript', 'Supabase', 'Mapbox', 'Capacitor'],
    cover: '🚌',
    demo: 'https://mindaride.online',
  },
  {
    title: 'Internship Management System',
    description:
      'An OJT platform for interns and supervisors: clock in/out with attendance PDF export, task and work logs, absence and overtime requests, project submissions with milestones, and document folders with per-user access.',
    tags: ['Svelte 5', 'Tailwind CSS', 'Google Apps Script', 'Google Sheets', 'Chart.js'],
    cover: '🎓',
    repo: 'https://github.com/RenXenoverse11/IMS',
  },
  {
    title: 'KPI Monitoring Dashboard',
    description:
      'An operations dashboard tracking KPIs across several network systems, each with its own view, editable targets, and planned-maintenance tracking. Runs as a Google Apps Script web app over Google Sheets, so the team keeps working in the tool they already use.',
    tags: ['Google Apps Script', 'Google Sheets', 'JavaScript', 'Bootstrap', 'GSAP'],
    cover: '📊',
    repo: 'https://github.com/RenXenoverse11/kpi-monitoring',
  },
]

export const socials: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/RenXenoverse11', icon: 'github' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/laurence-jan-bagaan-812ba33b7/',
    icon: 'linkedin',
  },
  { label: 'Facebook', href: 'https://www.facebook.com/renxen11/', icon: 'facebook' },
  {
    label: 'Upwork',
    href: 'https://www.upwork.com/freelancers/~01c91551d88f9a1a24',
    icon: 'upwork',
  },
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
export const contactEndpoint = 'https://formspree.io/f/mykaklod'
