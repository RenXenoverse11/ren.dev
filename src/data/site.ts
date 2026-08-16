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
  icon: 'code' | 'database' | 'terminal' | 'phone'
  items: Tech[]
}

export type Project = {
  title: string
  /** A string, or several for a card that reads in paragraphs. */
  description: string | string[]
  tags: string[]
  demo?: string
  repo?: string
  /** Screenshot served from `public/projects/`. Falls back to `cover`. */
  image?: string
  /**
   * CSS object-position for `image` (default 'top center'). The cover is a
   * fixed 16:9 frame; a portrait photo needs this pointed at whatever part
   * of the shot actually matters, or the crop just keeps the top of it.
   */
  imagePosition?: string
  /** Emoji shown on a gradient when there is no screenshot. */
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
  /**
   * Status badge above the hero heading. Update `label` as your situation
   * changes — e.g. 'Open to full-time roles' — or set `available: false` to
   * swap the dot to gray and drop the pulse.
   */
  availability: {
    available: true,
    label: 'Available for work',
  },
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
    icon: 'code',
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
      'MindaRide is a transportation information platform that helps users discover bus routes, terminals, transportation providers, and travel schedules across Mindanao. The platform provides a modern and user-friendly way to access transportation information, making travel planning more convenient and efficient. I was responsible for the full development of the project, including frontend development, backend integration, database design, UI/UX design, and system architecture using modern web technologies.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Responsive Design'],
    cover: '\u{1F68C}',
    image: '/projects/mindaride.webp',
    demo: 'https://mindaride.online',
  },
  {
    title: 'Internship Management System',
    description: [
      'IMS is a web-based Internship Management System built for tracking OJT hours, projects, requests, and activity logs for student interns.',
      "Built with Svelte and deployed on Google Apps Script, using Google Sheets as the database — a lightweight, zero-cost architecture that's fully functional in real-world use. Features a modern dark enterprise UI with dashboard analytics, progress tracking, document management, and role-based views.",
      'I handled full design and development — UI/UX, frontend, and backend integration.',
    ],
    tags: ['Svelte', 'Google Apps Script', 'JavaScript', 'Web Design', 'Google Spreadsheets API'],
    cover: '\u{1F393}',
    image: '/projects/IMS-dashboard.webp',
    demo: 'https://script.google.com/macros/s/AKfycbwyUDOp8pRephiqYVBXZAHGLhS6Ju-2g5XgUBCZG6LLiL047kP1euq1qM9u-Ahf1-q9/exec',
    repo: 'https://github.com/RenXenoverse11/IMS',
  },
  {
    title: 'KPI Monitoring Dashboard',
    description:
      'Built a Google Apps Script web dashboard for monitoring submarine cable system KPIs. The app reads structured Google Sheets data and presents performance views for Dashboard, SEA-US, Palau, IPOP, FSM, EMCS, and Planned Maintenance modules. I focused on clear reporting, maintainable sheet-driven data flow, and a dashboard layout that makes operational monitoring easier for the team.',
    tags: ['Google Apps Script', 'Google Sheets Automation', 'JavaScript', 'Bootstrap', 'Data Visualization'],
    cover: '\u{1F4CA}',
    image: '/projects/tsi-kpi-dashboard.webp',
    demo: 'https://script.google.com/macros/s/AKfycbwIZ_koIHSEcOIdf-bt2-ngz5bmenqh7FJ04bnLnoWU43Iylb6YyoPmI1qLXCeZx23h/exec',
    repo: 'https://github.com/RenXenoverse11/kpi-monitoring',
  },
  {
    title: 'First Aid Adventure',
    description: [
      'A thesis project built with two teammates: an interactive first-aid learning system for grade-school kids, running on a custom-built wooden arcade cabinet powered by a Raspberry Pi.',
      'Kids play through grade-level modules on a fullscreen Tkinter interface with audio guidance, while a camera and a TensorFlow Lite model check their hands-on first-aid technique in real time. Progress and scores are tracked per user in SQLite.',
      'I worked on the application logic, the Tkinter interface, and the camera-based detection pipeline.',
    ],
    tags: ['Python', 'Tkinter', 'OpenCV', 'TensorFlow Lite', 'Raspberry Pi', 'SQLite'],
    cover: '\u{1FA79}',
    /** The actual wooden arcade cabinet, not the in-app splash screen. */
    image: '/projects/first-aid-cabinet.webp',
    /** Portrait shot — keep the screen in frame, not the wood above it. */
    imagePosition: 'center 68%',
    repo: 'https://github.com/RenXenoverse11/first-aid-thesis',
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
