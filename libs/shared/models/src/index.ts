/**
 * @file libs/shared/models/src/index.ts
 * @description Canonical seed data — Joel M. Cossins' resume.
 *
 * Two purposes:
 *   1. Fallback in-memory data when no database is connected
 *   2. Source of truth for the database seed script
 *
 * MERGE NOTES: Full-stack resume used for profile summary.
 * .NET resume used for richer BigBear.ai highlights, WPF/XAML
 * detail, and explicit WCF/MVVM skill entries.
 */

import type {
  Profile,
  WorkExperience,
  Education,
  SkillCategory,
  Project,
  StackOption,
  FrontendStack,
  BackendStack,
  DatabaseStack,
} from '@devfolio/shared-interfaces';

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// Email is stored here for the seed script but never returned by the API.
// ─────────────────────────────────────────────────────────────────────────────

export const PROFILE_SEED: Profile = {
  name: 'Joel M. Cossins',
  title: 'Senior Full Stack Software Developer',
  summary:
    'Senior Full Stack Software Developer with 10+ years of experience building ' +
    'scalable, data-driven applications across modern web and backend platforms. ' +
    'Extensive professional experience with Angular and C#/.NET services, ' +
    'complemented by hands-on development using React and Vue/Nuxt. Strong ' +
    'background in designing internal APIs, client-server architectures, and ' +
    'SQL Server–backed systems in enterprise environments. ' +
    'Active Top Secret Clearance.',
  email: 'joel1227@proton.me',
  location: 'Remote — US',
  website: 'https://joelcossins.dev',
  github: 'https://github.com/pj1227',
  linkedin: undefined,
  avatarUrl: undefined,
};

// ─────────────────────────────────────────────────────────────────────────────
// WORK EXPERIENCE — most recent first
// ─────────────────────────────────────────────────────────────────────────────

export const WORK_EXPERIENCE_SEED: WorkExperience[] = [
  {
    id: 'we-001',
    company: 'Independent Software Developer',
    title: 'Independent Software Developer',
    location: 'Libby, MT',
    startDate: '2025-08',
    current: true,
    summary:
      'Designing and developing professional full stack applications across ' +
      'modern web frameworks backed by C#/.NET services, including both ' +
      'desktop and web targets.',
    highlights: [
      // from full-stack resume
      'Designed and developed professional full stack applications using Angular, React, and Vue/Nuxt backed by C#/.NET services.',
      'Built RESTful and internal APIs and service endpoints to support client-server and web-based applications.',
      'Worked with SQL Server and Entity Framework ORM for data access and persistence.',
      // from .NET resume — more specific
      'Built a WPF desktop application utilizing XAML, MVVM architecture, and Entity Framework to demonstrate modern WPF development practices.',
      'Applied AI-assisted development techniques to accelerate design, refactoring, and testing while maintaining code quality.',
      'Managed source control and documentation using Git and GitHub.',
    ],
    technologies: [
      'Angular', 'React', 'Vue', 'Nuxt', 'TypeScript',
      'C#', '.NET Core', 'WPF', 'XAML', 'MVVM',
      'SQL Server', 'Entity Framework', 'Git',
    ],
  },
  {
    id: 'we-002',
    company: 'BigBear.ai',
    title: 'Software Developer',
    location: 'Ann Arbor, MI',
    startDate: '2015-06',
    endDate: '2025-08',
    current: false,
    summary:
      'Led design, development, and delivery of complex, customer-specific ' +
      'software modules in a full stack client-server architecture supporting ' +
      'mission-critical U.S. Army systems for 10 years. Architected and ' +
      'executed the platform re-architecture from Silverlight/XAML to ' +
      'Angular/.NET Core, preserving full functional parity.',
    highlights: [
      // re-architecture story — strongest narrative, from .NET resume
      'Led the design, development, and implementation of customer-specific modules using Silverlight (XAML-based UI, MVVM patterns), enabling Army units, training centers, and installations to synchronize mission-critical operations.',
      'Re-architected and modernized these same modules during the transition from Silverlight to Angular and .NET Core, preserving functional parity while improving scalability, maintainability, and long-term platform viability.',
      // .NET Core service layer
      'Used .NET Core to develop server-side logic providing internal service APIs to the Angular client and connecting to MS SQL databases.',
      // Angular UI
      'Developed rich, data-driven user interfaces using Angular, leveraging components, directives, pipes, guards, and services to optimize client functionality.',
      // SQL Server
      'Designed and implemented MS SQL user-defined data types, functions, and stored procedures to streamline report generation and data management processes.',
      // Reporting
      'Collaborated on the design and deployment of a reporting service using Telerik Kendo, Syncfusion File Formats, EPPlus, and Dundas, enabling generation of detailed export products for senior leaders and staff.',
      'Provided technical support and strategic guidance to the onsite project liaison, effectively resolving issues in collaboration with the team.',
      'Participated in code reviews and collaborated with QA to ensure reliability and maintainability of mission-critical systems.',
    ],
    technologies: [
      'Angular', 'TypeScript', 'C#', '.NET Core',
      'SQL Server', 'Entity Framework', 'Silverlight', 'XAML', 'MVVM',
      'WCF', 'Telerik Kendo', 'Syncfusion', 'EPPlus', 'Dundas', 'Git',
    ],
    companyUrl: 'https://bigbear.ai',
  },
  {
    id: 'we-003',
    company: 'DTE Energy Trading',
    title: 'Programmer/Analyst',
    location: 'Ann Arbor, MI',
    startDate: '2004-08',
    endDate: '2015-06',
    current: false,
    summary:
      'Full stack developer and analyst in an energy trading environment, ' +
      'building web applications, desktop tools, reporting services, and ' +
      'automation systems used directly by gas and power traders.',
    highlights: [
      'Used .NET, C#, VBScript, and Java to develop websites, desktop applications, scripts, and reporting services.',
      'Worked directly with traders to create a logging and reporting page managing display of critical storage facility information for natural gas trading along the Eastern seaboard.',
      'Created a gas utilization page displaying market prices, gas pipeline utilization, and weather for specific pipeline points — a valued daily tool for traders.',
      'Created a NYMEX natural gas report displaying week-over-week, month-over-month, and year-over-year price changes plus historical vs. settle gas futures.',
      'Created an internal NuGet server to manage .NET package dependencies across all DTE ET applications, with automatic package restoration and versioning control.',
      'Designed and implemented automations for gas traders and operational staff — web scraping, file downloading, email attachment parsing, database persistence — saving hours per day.',
      'Reduced scheduling coordination time from 7 hours to 4 hours by improving workflow efficiency.',
    ],
    technologies: [
      'C#', '.NET', 'VBScript', 'Java',
      'SQL Server', 'ASP.NET', 'NuGet', 'Automation',
    ],
  },
  {
    id: 'we-004',
    company: 'MCI WorldCom / UUNet / ANS Communications',
    title: 'LAN/WAN Install Engineer',
    location: 'US',
    startDate: '1998-11',
    endDate: '2003-03',
    current: false,
    summary:
      'Configured and maintained corporate network infrastructure ensuring ' +
      'reliable internet and DNS services for enterprise customers.',
    highlights: [
      'Delivered Internet installations by testing, installing, configuring, and troubleshooting network hardware and digital circuits per U.S. and international specifications.',
      'Configured and administered DNS infrastructure.',
      'Designed and implemented a web-based library of instructional documents for training of fellow engineers.',
    ],
    technologies: ['Networking', 'DNS', 'LAN/WAN', 'TCP/IP', 'HTML'],
  },
  {
    id: 'we-005',
    company: 'United States Air Force',
    title: 'Communication Computer Systems Control Specialist',
    location: 'Various',
    startDate: '1991-11',
    endDate: '1998-11',
    current: false,
    summary:
      'Managed, configured, and maintained mission-critical communication ' +
      'networks supporting NORAD, USSPACECOM, and AFSPC.',
    highlights: [
      'Managed, configured, and maintained communication networks for mission-critical operations.',
      'Installed servers, patch panels, and network infrastructure supporting NORAD, United States Space Command, and Air Force Space Command.',
      'Configured and maintained routers linking Incirlik AB to the USAF NIPRNet.',
      'Streamlined training processes for 27 personnel at Incirlik AB.',
      'Delivered command, control, and communications support to the Joint Task Force Southwest Asia.',
      "Restored full network functionality at Shaw AFB by mapping the 9th Air Force Squadron's LAN and replacing faulty terminal connectors.",
    ],
    technologies: ['Networking', 'Routers', 'LAN/WAN', 'Communications Systems'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EDUCATION
// ─────────────────────────────────────────────────────────────────────────────

export const EDUCATION_SEED: Education[] = [
  {
    id: 'edu-001',
    institution: 'American Intercontinental University',
    degree: 'Bachelor of Science',
    field: 'Information Technology',
    startDate: '2007-01',
    endDate: '2008-12',
    current: false,
    highlights: ['AIU Online'],
  },
  {
    id: 'edu-002',
    institution: 'College of the Air Force',
    degree: 'Associate of Applied Science',
    field: 'Electronic Systems Technology',
    startDate: '1995-01',
    endDate: '1998-12',
    current: false,
    highlights: ['Completed during active duty USAF service'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SKILLS
// ─────────────────────────────────────────────────────────────────────────────

export const SKILLS_SEED: SkillCategory[] = [
  {
    category: 'Frontend',
    skills: [
      { name: 'Angular', proficiency: 'expert', yearsOfExperience: 10, highlighted: true },
      { name: 'React', proficiency: 'advanced', yearsOfExperience: 3, highlighted: true },
      { name: 'Vue / Nuxt', proficiency: 'advanced', yearsOfExperience: 2 },
      { name: 'TypeScript', proficiency: 'expert', yearsOfExperience: 8, highlighted: true },
      { name: 'JavaScript', proficiency: 'expert', yearsOfExperience: 12 },
      { name: 'HTML / CSS', proficiency: 'expert', yearsOfExperience: 15 },
    ],
  },
  {
    category: 'Backend',
    skills: [
      { name: 'C# / .NET Core', proficiency: 'expert', yearsOfExperience: 10, highlighted: true },
      { name: 'RESTful APIs / Internal Service Endpoints', proficiency: 'expert', yearsOfExperience: 10 },
      { name: 'WCF (legacy)', proficiency: 'advanced', yearsOfExperience: 6 },
      { name: 'WPF / XAML', proficiency: 'advanced', yearsOfExperience: 4 },
      { name: 'Silverlight / XAML', proficiency: 'advanced', yearsOfExperience: 4 },
      { name: 'MVVM / MVC', proficiency: 'expert', yearsOfExperience: 10 },
    ],
  },
  {
    category: 'Data',
    skills: [
      { name: 'SQL Server', proficiency: 'expert', yearsOfExperience: 10, highlighted: true },
      { name: 'Entity Framework', proficiency: 'expert', yearsOfExperience: 8 },
      { name: 'Stored Procedures', proficiency: 'expert', yearsOfExperience: 10 },
      { name: 'Relational DB Design', proficiency: 'expert', yearsOfExperience: 10 },
    ],
  },
  {
    category: 'Architecture & Design',
    skills: [
      { name: 'Full Stack Architecture', proficiency: 'expert', yearsOfExperience: 10 },
      { name: 'Client-Server Architecture', proficiency: 'expert', yearsOfExperience: 10 },
      { name: 'Component-Based UI Design', proficiency: 'expert', yearsOfExperience: 10 },
      { name: 'Legacy Platform Re-Architecture', proficiency: 'advanced', yearsOfExperience: 5 },
    ],
  },
  {
    category: 'Testing & Quality',
    skills: [
      { name: 'Unit Testing', proficiency: 'expert', yearsOfExperience: 8 },
      { name: 'TDD', proficiency: 'advanced', yearsOfExperience: 5 },
      { name: 'Code Reviews', proficiency: 'expert', yearsOfExperience: 8 },
    ],
  },
  {
    category: 'Tools & Workflow',
    skills: [
      { name: 'Git / GitHub / Bitbucket', proficiency: 'expert', yearsOfExperience: 10 },
      { name: 'Visual Studio / VS Code', proficiency: 'expert', yearsOfExperience: 12 },
      { name: 'Jira / Confluence', proficiency: 'advanced', yearsOfExperience: 8 },
      { name: 'AI-Assisted Dev (AIDD)', proficiency: 'advanced', yearsOfExperience: 2, highlighted: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────────────────────────────

export const PROJECTS_SEED: Project[] = [
  {
    id: 'proj-001',
    name: 'DevFolio',
    description: 'This portfolio — a polyglot full stack architecture demo',
    summary:
      'A developer portfolio that deliberately serves the same resume data from ' +
      'multiple frontend frameworks (Next.js, Nuxt, Angular), backend languages ' +
      '(Python/FastAPI, PHP/Laravel, Ruby/Rails, C#/ASP.NET Core), and databases. ' +
      'Shared TypeScript interfaces act as the contract across every implementation.',
    technologies: [
      'Next.js', 'React', 'TypeScript', 'Tailwind CSS',
      'FastAPI', 'Python', 'PostgreSQL', 'Nx', 'pnpm',
    ],
    githubUrl: 'https://github.com/pj1227/devfolio',
    featured: true,
    startDate: '2025-08',
    current: true,
    highlights: [
      'Shared TypeScript interfaces enforce one contract across 3 frontends and 4 backends',
      'Live /api/tech-stack endpoint proves each implementation is real, not hardcoded',
      'Nx monorepo with pnpm workspaces — one Tailwind preset drives all frontends',
      'TDD from the start — tests written before implementation in every phase',
    ],
    category: 'web',
  },
  {
    id: 'proj-002',
    name: 'WPF Weather or Not',
    description: 'WPF desktop weather app in C# / .NET',
    summary:
      'A WPF desktop application demonstrating continued proficiency with ' +
      '.NET UI frameworks. Fetches live weather data using MVVM patterns.',
    technologies: ['C#', '.NET', 'WPF', 'XAML', 'MVVM'],
    githubUrl: 'https://github.com/pj1227/WPF-Weather-or-Not',
    featured: true,
    startDate: '2025-08',
    current: false,
    highlights: [
      'MVVM architecture with clean separation of concerns',
      'Live weather API integration via C# HttpClient',
      'XAML data binding and custom control styling',
    ],
    category: 'other',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// STACK SELECTOR OPTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const FRONTEND_STACK_OPTIONS: StackOption<FrontendStack>[] = [
  {
    value: 'next', label: 'Next.js', version: '15.x',
    language: 'TypeScript', phase: 1, available: true,
    apiBaseUrl: process.env['NEXT_PUBLIC_GATEWAY_URL'] ?? 'http://localhost:3001',
  },
  { value: 'nuxt', label: 'Nuxt', version: '3.x', language: 'TypeScript', phase: 2, available: false },
  { value: 'angular', label: 'Angular', version: '19.x', language: 'TypeScript', phase: 3, available: false },
];

export const BACKEND_STACK_OPTIONS: StackOption<BackendStack>[] = [
  {
    value: 'fastapi', label: 'FastAPI', version: '0.115.x',
    language: 'Python', phase: 1, available: true,
    apiBaseUrl: process.env['NEXT_PUBLIC_GATEWAY_URL'] ?? 'http://localhost:3001',
  },
  { value: 'laravel', label: 'Laravel', version: '11.x', language: 'PHP', phase: 2, available: false },
  { value: 'rails', label: 'Ruby on Rails', version: '8.x', language: 'Ruby', phase: 3, available: false },
  { value: 'aspnet', label: 'ASP.NET Core', version: '9.x', language: 'C#', phase: 4, available: false },
];

export const DATABASE_STACK_OPTIONS: StackOption<DatabaseStack>[] = [
  { value: 'postgres', label: 'PostgreSQL', version: '17.x', language: 'SQL', phase: 1, available: true },
  { value: 'mysql', label: 'MySQL', version: '8.x', language: 'SQL', phase: 2, available: false },
  { value: 'mssql', label: 'SQL Server', version: '2022', language: 'T-SQL', phase: 3, available: false },
  { value: 'mongodb', label: 'MongoDB', version: '8.x', language: 'MQL', phase: 4, available: false },
];
