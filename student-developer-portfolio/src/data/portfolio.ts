export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tech: string[];
  github: string;
  demo?: string;
  featured: boolean;
  category?: 'Full Stack' | 'Frontend' | 'Backend' | 'Tooling';
}

export interface Skill {
  id: string;
  name: string;
  status: 'Comfortable' | 'Learning & Building' | 'Learning';
  category: 'Frontend' | 'Backend' | 'Languages' | 'Tools & DevOps';
  iconName?: string;
}

export interface LearningItem {
  id: string;
  name: string;
  category: string;
  status: 'In Progress' | 'Exploring' | 'Next Up';
  description: string;
  progressPercentage: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  year: string;
  link: string;
  credentialId?: string;
}

export interface PortfolioData {
  name: string;
  shortName: string;
  role: string;
  headline: string;
  bio: string;
  currentFocus: string;
  studentStatus: string;
  learningMindset: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
  resumeFileName?: string;
  resumeUpdatedAt?: string;
  resumeFileSize?: string;
  projects: Project[];
  learning: LearningItem[];
  skills: Skill[];
  certificates: Certificate[];
}

export const initialPortfolioData: PortfolioData = {
  name: "Harji Mallhi",
  shortName: "HM",
  role: "Student Developer",
  headline: "Building Modern Web Apps & Exploring Real-Time Systems",
  bio: "I'm a passionate computer science student and developer focused on building functional, responsive web applications and backend services. I believe in learning by shipping real software, testing ideas in code, and constantly expanding my technical stack.",
  currentFocus: "Deepening knowledge in TypeScript, Full-Stack Architecture, Real-Time WebSockets, and Database Design.",
  studentStatus: "Undergraduate Computer Science Student • Actively seeking internships and collaborative open-source opportunities.",
  learningMindset: "Curious, hands-on, and disciplined. I enjoy dissecting complex engineering problems, reading documentation, and iterating on projects until they are clean and performant.",
  location: "Open to Remote & On-Site",
  email: "harjimallhi9@gmail.com",
  github: "https://github.com/harjimallhi9",
  linkedin: "https://www.linkedin.com/in/harji-mallhi/",
  resume: "/resume.pdf",

  projects: [
    {
      id: "gps-tracker",
      title: "Real-Time GPS Tracker",
      description: "A real-time device and fleet location tracking application using bidirectional WebSocket communication and the browser Geolocation API for sub-second position updates.",
      longDescription: "Built with Node.js, Express, Socket.IO, and interactive maps. Coordinates are broadcasted across connected client sockets with smooth marker interpolations and live telemetry display.",
      tech: ["JavaScript", "Node.js", "Express", "Socket.IO", "Browser Geolocation API"],
      github: "https://github.com/harjimallhi9/code-learning",
      demo: "https://github.com/harjimallhi9/code-learning",
      featured: true,
      category: "Full Stack"
    },
    {
      id: "campus-connect",
      title: "Campus Connect",
      description: "Collaborative study group portal for students to discover peer study circles, share course notes, and coordinate exam prep schedules.",
      longDescription: "Features categorized discussion boards, topic tag filtering, responsive dark/light UI with clean card components, and local bookmarking.",
      tech: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
      github: "https://github.com/harjimallhi9/code-learning",
      demo: "https://github.com/harjimallhi9/code-learning",
      featured: true,
      category: "Frontend"
    },
    {
      id: "dev-notes",
      title: "DevNotes Knowledge Base",
      description: "Fast, distraction-free markdown knowledge base designed for developers to document code snippets, debug logs, and architecture decisions.",
      longDescription: "Includes markdown live preview, tag categorization, full-text client search, syntax highlighting, and keyboard shortcuts.",
      tech: ["React", "Node.js", "Express", "PostgreSQL"],
      github: "https://github.com/harjimallhi9/code-learning",
      demo: "https://github.com/harjimallhi9/code-learning",
      featured: true,
      category: "Full Stack"
    },
    {
      id: "algo-visualizer",
      title: "Algorithm Visualizer Studio",
      description: "Interactive visual simulator for sorting, pathfinding (Dijkstra, A*), and graph traversal algorithms with step-by-step playback controls.",
      longDescription: "Helps computer science students visualize time/space complexity, array partitioning, and recursive calls with smooth animation transitions.",
      tech: ["TypeScript", "React", "Framer Motion", "Tailwind CSS"],
      github: "https://github.com/harjimallhi9/code-learning",
      demo: "https://github.com/harjimallhi9/code-learning",
      featured: false,
      category: "Tooling"
    }
  ],

  learning: [
    {
      id: "learn-react",
      name: "React & Modern Architecture",
      category: "Frontend",
      status: "In Progress",
      description: "Mastering custom hooks, concurrent rendering, performance profiling, and accessible design patterns.",
      progressPercentage: 88
    },
    {
      id: "learn-ts",
      name: "TypeScript Deep Dive",
      category: "Languages",
      status: "In Progress",
      description: "Generics, utility types, conditional typing, strict typing invariants, and full type safety across app boundaries.",
      progressPercentage: 82
    },
    {
      id: "learn-postgres",
      name: "PostgreSQL & Relational Design",
      category: "Database",
      status: "In Progress",
      description: "Data modeling, indexing, foreign keys, query optimization, joins, and transaction isolation levels.",
      progressPercentage: 70
    },
    {
      id: "learn-nodejs",
      name: "Node.js & Express",
      category: "Backend",
      status: "In Progress",
      description: "Event loop internals, streams, REST API architecture, authentication middleware, and security practices.",
      progressPercentage: 78
    },
    {
      id: "learn-docker",
      name: "Docker & Containerization",
      category: "DevOps",
      status: "Exploring",
      description: "Multi-stage builds, container networks, Docker Compose environments, and deployment workflows.",
      progressPercentage: 55
    },
    {
      id: "learn-nestjs",
      name: "NestJS Framework",
      category: "Backend",
      status: "Exploring",
      description: "Enterprise backend architecture, dependency injection, modules, decorators, and DTO validations.",
      progressPercentage: 50
    },
    {
      id: "learn-prisma",
      name: "Prisma ORM",
      category: "Database",
      status: "Exploring",
      description: "Type-safe database queries, schema migrations, and seamless integration with PostgreSQL and TypeScript.",
      progressPercentage: 62
    },
    {
      id: "learn-vue",
      name: "Vue 3 & Composition API",
      category: "Frontend",
      status: "Next Up",
      description: "Reactivity model comparison, Pinia state management, and template compiler differences with JSX.",
      progressPercentage: 40
    },
    {
      id: "learn-laravel",
      name: "Laravel & PHP Modern Ecosystem",
      category: "Full Stack",
      status: "Next Up",
      description: "MVC patterns, Eloquent ORM, Blade templating, and rapid backend prototyping principles.",
      progressPercentage: 35
    }
  ],

  skills: [
    { id: "s-js", name: "JavaScript (ES6+)", status: "Comfortable", category: "Languages" },
    { id: "s-react", name: "React", status: "Comfortable", category: "Frontend" },
    { id: "s-html-css", name: "HTML5 & CSS3", status: "Comfortable", category: "Frontend" },
    { id: "s-git", name: "Git & GitHub", status: "Comfortable", category: "Tools & DevOps" },
    { id: "s-ts", name: "TypeScript", status: "Learning & Building", category: "Languages" },
    { id: "s-node", name: "Node.js", status: "Learning & Building", category: "Backend" },
    { id: "s-express", name: "Express.js", status: "Learning & Building", category: "Backend" },
    { id: "s-rest", name: "REST APIs", status: "Learning & Building", category: "Backend" },
    { id: "s-sockets", name: "Socket.IO", status: "Learning & Building", category: "Backend" },
    { id: "s-tailwind", name: "Tailwind CSS", status: "Comfortable", category: "Frontend" },
    { id: "s-postgres", name: "PostgreSQL", status: "Learning", category: "Backend" },
    { id: "s-docker", name: "Docker", status: "Learning", category: "Tools & DevOps" },
    { id: "s-linux", name: "Linux Basics & Shell", status: "Learning & Building", category: "Tools & DevOps" },
    { id: "s-vite", name: "Vite & Tooling", status: "Comfortable", category: "Tools & DevOps" }
  ],

  certificates: [
    {
      id: "cert-cs50",
      title: "CS50x: Introduction to Computer Science",
      issuer: "Harvard University / edX",
      year: "2024",
      link: "https://cs50.harvard.edu/x/",
      credentialId: "CS50x-VERIFIED-2024"
    },
    {
      id: "cert-fcc-js",
      title: "JavaScript Algorithms & Data Structures",
      issuer: "freeCodeCamp",
      year: "2024",
      link: "https://www.freecodecamp.org/certification/fcc/javascript-algorithms-and-data-structures",
      credentialId: "FCC-JS-ALGO-2024"
    },
    {
      id: "cert-meta-fe",
      title: "Meta Front-End Developer Foundations",
      issuer: "Meta / Coursera",
      year: "2023",
      link: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      credentialId: "META-FED-99201"
    }
  ]
};

// Storage Key for LocalStorage
export const PORTFOLIO_STORAGE_KEY = "student_portfolio_data_v1";

export function loadPortfolioData(): PortfolioData {
  if (typeof window === "undefined") {
    return initialPortfolioData;
  }
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with default keys to ensure compatibility
      return {
        ...initialPortfolioData,
        ...parsed,
        projects: parsed.projects?.length ? parsed.projects : initialPortfolioData.projects,
        skills: parsed.skills?.length ? parsed.skills : initialPortfolioData.skills,
        learning: parsed.learning?.length ? parsed.learning : initialPortfolioData.learning,
        certificates: parsed.certificates?.length ? parsed.certificates : initialPortfolioData.certificates,
      };
    }
  } catch (err) {
    console.warn("Failed to read from localStorage:", err);
  }
  return initialPortfolioData;
}

export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

export function resetPortfolioData(): PortfolioData {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(PORTFOLIO_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  }
  return initialPortfolioData;
}
