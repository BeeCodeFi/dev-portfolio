import dp from './dp.jpg'

export const profile = {
  dp,
  name: 'Ayush Kumar',
  firstName: 'Ayush',
  lastName: 'Kumar',
  title: 'Software Engineer',
  subtitle: 'Full Stack Developer',
  roles: ['Software Engineer', 'Full Stack Developer', 'UI Architect', 'Cloud Builder'],
  phone: '+91-7004900272',
  email: 'kumaryursh@gmail.com',
  linkedin: 'https://linkedin.com/in/ayushku',
  github: 'https://github.com/BeeCodeFi',
  summary:
    'Results-driven Software Engineer with 2+ years of experience architecting and delivering scalable enterprise web applications using React.js, Vue.js, Angular, .NET Core, and Node.js. Proven track record of building reusable component libraries, integrating REST APIs within microservice architectures, and deploying cloud-enabled applications on AWS. Adept at leveraging AI tools to accelerate development cycles, with a focus on production stability.',
}

export const stats = [
  { value: 2, suffix: '+', label: 'Years shipping enterprise software' },
  { value: 95, suffix: '%', label: 'Test coverage achieved' },
  { value: 15, suffix: '%', label: 'Less feature development effort' },
  { value: 3, suffix: '+', label: 'Product teams using my libraries' },
]

export const skills: { category: string; items: string[] }[] = [
  { category: 'Languages', items: ['JavaScript (ES6+)', 'TypeScript', 'C#'] },
  { category: 'Frontend', items: ['React.js', 'Angular', 'Vue.js', 'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'PrimeVue'] },
  { category: 'Backend', items: ['.NET Core', 'ASP.NET Core', 'Node.js', 'Express.js'] },
  { category: 'Cloud & Databases', items: ['AWS CloudFront', 'EC2', 'S3', 'IAM', 'RDS', 'MongoDB', 'SQL Server', 'Redis'] },
  { category: 'Testing & DevOps', items: ['Jest', 'Vitest', 'React Testing Library', 'Docker', 'Git', 'GitHub', 'CI/CD', 'Postman'] },
  { category: 'Architecture', items: ['REST APIs', 'Microservices', 'GraphQL', 'JWT Auth', 'SPA', 'Responsive Design', 'System Design'] },
  { category: 'AI & LLM Tools', items: ['GitHub Copilot', 'Claude AI', 'OpenAI APIs', 'LLM Integration'] },
]

export const experience = [
  {
    company: 'Cybage Software',
    role: 'Software Engineer',
    division: 'Enterprise Products Division',
    period: 'Nov 2023 — Present',
    points: [
      'Architected and delivered scalable React.js and Vue.js front-end applications for enterprise financial products, improving usability and end-to-end reliability.',
      'Engineered reusable component libraries adopted by 3+ product teams, reducing feature development effort by 15% and accelerating release cycles.',
      'Integrated REST APIs with .NET Core backend services in microservice-based architectures, ensuring seamless, secure data flow across distributed systems.',
      'Optimized UI performance via lazy loading, memoization, and code splitting for faster page loads and smoother interactions.',
      'Implemented unit and integration tests with Jest and React Testing Library, achieving 95% coverage and reducing production defects.',
      'Enforced coding standards through structured pull request reviews and GitHub workflows, reducing technical debt.',
      'Leveraged GitHub Copilot and Claude AI to accelerate delivery and keep code consistent across sprints.',
      'Delivered features on schedule through Agile/Scrum: sprint planning, standups and retrospectives.',
    ],
  },
]

export type Project = {
  title: string
  tag?: string
  stack: string[]
  points: string[]
  palette: [string, string]
  motif: 'social' | 'travel' | 'finance'
}

export const projects: Project[] = [
  {
    title: 'Social Media Platform',
    stack: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'OpenAI APIs'],
    points: [
      'Full-stack social app with an Angular front end and Node.js/Express backend, supporting user-generated content at scale.',
      'JWT authentication and role-based access control to secure sessions and protect sensitive endpoints.',
      'Scalable NoSQL data model in MongoDB for growing volumes of content and social interactions.',
    ],
    palette: ['#f472b6', '#8b5cf6'],
    motif: 'social',
  },
  {
    title: 'Hospitality & Travel Booking',
    stack: ['React.js', 'Zustand', 'REST APIs', 'Jest', 'Responsive Design'],
    points: [
      'Full-featured booking platform with React and Zustand, delivering a seamless cross-device experience.',
      'Third-party REST APIs for real-time availability, dynamic pricing and booking workflow automation.',
      'Reusable responsive component library, with Jest coverage across critical booking flows.',
    ],
    palette: ['#22d3ee', '#3b82f6'],
    motif: 'travel',
  },
  {
    title: 'Financial Partner Management',
    tag: 'AI-Powered',
    stack: ['Vue.js', '.NET Core', 'C#', 'AWS S3', 'Vitest', 'REST APIs'],
    points: [
      'AI-powered partner and customer success portal for onboarding, account management and workflow orchestration.',
      'Responsive Vue.js interfaces backed by .NET Core microservices for secure, real-time financial data and compliance.',
      'AWS S3 document storage for audit and compliance, with Vitest validating business-critical features.',
    ],
    palette: ['#a3e635', '#14b8a6'],
    motif: 'finance',
  },
]

export const education = {
  degree: 'Bachelor of Technology — Computer Science & Engineering',
  school: 'KIIT University',
  grade: 'CGPA 8.0 / 10',
  period: '2019 — 2023',
}
