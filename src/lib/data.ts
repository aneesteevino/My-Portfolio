/**
 * Biography, skills, experience and project copy: Resume.pdf, supplied 2026-10-11.
 * Repository URLs: verified public GitHub inventory, permitted by the user's
 * additional instruction. A similarly named repo is not treated as proof of identity.
 * UI labels and decorative identifiers are editorial, not biographical claims.
 */
export const PROFILE = {
  name: "Muhammad Anees",
  firstName: "Muhammad",
  initials: "MA",
  role: "AI Engineer",
  specialisms: ["Agentic AI & LLM Systems", "AI Automation"],
  email: "aneeskhanteevino12@gmail.com",
  phone: "+92 344 1672985",
  phoneHref: "tel:+923441672985",
  location: null,
  resumeSummary:
    "AI Engineer specializing in LLM-powered applications, Agentic AI workflows, and RAG systems. Experienced in deploying multi-model AI services (OpenAI, Claude, Gemini, Groq) on production backends built with Python, FastAPI, and Node.js. Skilled in prompt and context engineering, semantic search, vector databases, and n8n automation, turning business requirements into scalable AI products.",
  shortLine:
    "Applied prompt and context engineering to reduce hallucination; built agent-based workflows and recommendation systems.",
  quote: "Turning business requirements into scalable AI products.",
  careerDirection:
    "AI engineering focused on LLM-powered applications, agentic workflows, RAG systems, automation, and scalable AI products.",
  github: "https://github.com/AneesTeevino",
  linkedin: "https://linkedin.com/in/anees-teevino",
  resume: "/resume.pdf",
  portrait: "/portrait-card.png",
  poster: "/hero/poster.webp",
  video: { webm: "/hero/hero.webm", mp4: "/hero/hero.mp4" },
  currentRole: "AI Engineer · The Deft Crew",
  graduationYear: "2027",
  educationShort: "B.S. Artificial Intelligence",
  educationCaption: "MUET · 2023–2027",
  idLines: [
    "AI Engineer",
    "B.S. Artificial Intelligence",
    "CGPA 3.38 / 4.00",
    "Agentic AI & LLM Systems",
    "AI Automation",
  ],
} as const;

export type Project = {
  id: string;
  index: string;
  title: string;
  kicker: string;
  year: string;
  description: string;
  features: string[];
  tech: string[];
  github?: string;
  demo?: string;
  illustration: "resume" | "career" | "chat" | "travel" | "legal" | "plan";
};
export const PROJECTS: Project[] = [
  {
    id: "plot2plan",
    index: "01",
    title: "Plot2Plan AI",
    kicker: "AI-assisted architectural planning",
    year: "2026",
    description:
      "Turns plot measurements and a building brief into dimensioned, validated floor-plan concepts and a PDF planning report for residential plots in Pakistan.",
    features: [
      "Dimensioned multi-floor plans",
      "Layout validation checks",
      "PDF planning report",
      "AI-assisted plot reading",
    ],
    tech: [
      "Next.js",
      "TypeScript",
      "React",
      "MongoDB",
      "Tailwind CSS",
      "Zod",
      "Hugging Face",
    ],
    github: "https://github.com/aneesteevino/plot2plan-ai",
    demo: "https://plot2plan-ai.vercel.app/",
    illustration: "plan",
  },
  {
    id: "legal",
    index: "02",
    title: "Pakistani Legal Assistant",
    kicker: "Citation-grounded RAG",
    year: "2025",
    description:
      "Citation-grounded RAG legal guidance across five law domains with confidence scoring and source attribution.",
    features: [
      "Five law domains",
      "Confidence scoring",
      "Source attribution",
      "Citation-grounded RAG",
    ],
    tech: ["Python", "FastAPI", "React", "Gemini", "RAG"],
    github: "https://github.com/aneesteevino/Pakistani-Legal-Assistant",
    illustration: "legal",
  },
  {
    id: "travel",
    index: "03",
    title: "Pakistan Travel RAG System",
    kicker: "Context-aware itineraries",
    year: "2025",
    description:
      "FAISS semantic search over destination, hotel, and activity data for context-aware travel itineraries.",
    features: [
      "Destination data",
      "Hotel data",
      "Activity data",
      "Context-aware itineraries",
    ],
    tech: ["FastAPI", "FAISS", "Vector Search", "RAG", "Embeddings"],
    github: "https://github.com/aneesteevino/pakistan-travel-rag",
    illustration: "travel",
  },
  {
    id: "resume",
    index: "04",
    title: "AI Resume Builder",
    kicker: "Multi-model LLM platform",
    year: "2026",
    description:
      "Multi-model LLM platform with RAG-based role-specific rewriting, ATS scoring, and PDF generation.",
    features: [
      "Role-specific rewriting",
      "ATS scoring",
      "PDF generation",
      "Multi-model LLMs",
    ],
    tech: [
      "Python",
      "FastAPI",
      "OpenAI",
      "Gemini",
      "Claude",
      "Groq",
      "MongoDB",
      "RAG",
    ],
    illustration: "resume",
  },
  {
    id: "career",
    index: "05",
    title: "AI Career Assistant",
    kicker: "Conversational assistant",
    year: "2026",
    description:
      "Conversational assistant for job recommendations and career roadmaps across multiple LLM providers.",
    features: [
      "Job recommendations",
      "Career roadmaps",
      "Multiple LLM providers",
    ],
    tech: [
      "Python",
      "FastAPI",
      "LLMs",
      "MongoDB",
      "OpenAI",
      "Gemini",
      "Claude",
    ],
    illustration: "career",
  },
  {
    id: "chat",
    index: "06",
    title: "TDC AI Chat Service",
    kicker: "Standalone chat microservice",
    year: "2026",
    description:
      "Standalone chat microservice with intelligent routing, multi-model integration, and knowledge sync.",
    features: [
      "Intelligent routing",
      "Multi-model integration",
      "Knowledge sync",
    ],
    tech: ["Node.js", "TypeScript", "MongoDB", "REST APIs", "Microservices"],
    illustration: "chat",
  },
];

export type Skill = {
  name: string;
  symbol: string;
  key: string;
  aliases?: string[];
};
export type SkillGroup = { family: string; skills: Skill[] };
const skill = (
  name: string,
  symbol: string,
  key: string,
  aliases?: string[],
): Skill => ({ name, symbol, key, aliases });
export const SKILL_GROUPS: SkillGroup[] = [
  {
    family: "Languages",
    skills: [
      skill("Python", "Py", "python"),
      skill("TypeScript", "Ts", "typescript"),
      skill("JavaScript", "Js", "javascript"),
      skill("SQL", "Sq", "sql"),
    ],
  },
  {
    family: "AI & LLM Frameworks",
    skills: [
      skill("LangChain", "Lc", "langchain"),
      skill("LangGraph", "Lg", "langgraph"),
      skill("CrewAI", "Cr", "crewai"),
      skill("AutoGen", "Ag", "autogen"),
      skill("OpenAI", "Oa", "openai"),
      skill("Gemini", "Ge", "gemini"),
      skill("Claude (Anthropic)", "Cl", "claude", ["Claude"]),
      skill("Groq APIs", "Gq", "groq", ["Groq"]),
      skill("Ollama", "Ol", "ollama"),
    ],
  },
  {
    family: "AI Technologies",
    skills: [
      skill("Prompt & Context Engineering", "Pc", "prompt"),
      skill("Agentic AI", "Ai", "agent", ["AI agents", "agentic workflows"]),
      skill("Multi-Agent Collaboration", "Ma", "agents", ["multi-agent systems"]),
      skill("Tool Calling", "Tc", "tools"),
      skill("RAG", "Ra", "rag"),
      skill("Embeddings", "Em", "embeddings"),
      skill("Semantic/Vector Search", "Vs", "vector", ["Vector Search"]),
      skill("LLM Orchestration", "Lo", "orchestration"),
      skill("Recommendation Systems", "Rs", "recommendations"),
    ],
  },
  {
    family: "Automation & Backend",
    skills: [
      skill("n8n", "Nn", "n8n", ["automation", "workflow automation"]),
      skill("FastAPI", "Fa", "fastapi"),
      skill("Node.js", "Nd", "nodejs"),
      skill("Express.js", "Ex", "express"),
      skill("REST APIs", "Re", "rest"),
      skill("Microservices", "Ms", "microservices"),
      skill("OAuth", "Au", "oauth"),
      skill("Webhooks", "Wh", "webhooks"),
    ],
  },
  {
    family: "Databases",
    skills: [
      skill("MongoDB", "Mo", "mongodb"),
      skill("PostgreSQL", "Pg", "postgresql"),
      skill("MySQL", "My", "mysql"),
      skill("FAISS", "Fs", "faiss"),
      skill("Supabase pgvector", "Sp", "supabase"),
    ],
  },
  {
    family: "Frontend, DevOps & Tools",
    skills: [
      skill("Next.js", "Nx", "nextjs"),
      skill("React.js", "Rc", "react", ["React"]),
      skill("Tailwind CSS", "Tw", "tailwindcss"),
      skill("ShadCN UI", "Sh", "shadcn"),
      skill("Docker", "Dk", "docker"),
      skill("Git & GitHub", "Gh", "github"),
      skill("GitHub Copilot", "Gc", "copilot"),
      skill("VS Code", "Vc", "vscode"),
      skill("Windsurf", "Ws", "windsurf"),
    ],
  },
  {
    family: "Project technologies",
    skills: [
      skill("LLMs", "Lm", "llms"),
      skill("Sentence Transformers", "St", "transformers"),
      skill("LLaMA 3", "Ll", "llama"),
    ],
  },
];
export type PathEntry = {
  id: string;
  sort: string;
  date: string;
  title: string;
  place: string;
  details: string[];
  kind: "Education" | "Experience";
};
export const EXPERIENCE: PathEntry[] = [
  {
    id: "tdc",
    sort: "2026-03",
    date: "Mar 2026 — present",
    title: "AI Engineer",
    place: "The Deft Crew (TDC)",
    kind: "Experience",
    details: [
      "Architected an AI Resume Builder (LLM content generation, ATS scoring, PDF generation) and an AI Career Assistant orchestrating OpenAI, Gemini, Claude, and Groq via a unified API.",
      "Built and deployed a standalone AI Chat Service (Node.js, TypeScript) with intelligent request routing across a multi-model architecture.",
      "Designed a Knowledge Sync Pipeline and MongoDB-backed RAG pipelines with semantic search, improving response grounding.",
      "Applied prompt and context engineering to reduce hallucination; built agent-based workflows and recommendation systems.",
    ],
  },
  {
    id: "muet-fm",
    sort: "2024",
    date: "2024",
    title: "Web Development Intern",
    place: "MUET FM 92.6",
    kind: "Experience",
    details: [
      "Built and deployed a full-stack, responsive website for the university radio station with live broadcast integration.",
    ],
  },
];
export const EDUCATION: PathEntry[] = [
  {
    id: "muet",
    sort: "2023-07",
    date: "Jul 2023 — Aug 2027",
    title: "B.S. Artificial Intelligence",
    place:
      "Mehran University of Engineering & Technology (MUET), Jamshoro, Sindh",
    kind: "Education",
    details: ["CGPA: 3.38 / 4.00"],
  },
];
export const CERTIFICATIONS = [
  {
    title: "Discover the Art of Prompting",
    issuer: "Google · Coursera",
    year: "2025",
    url: null,
  },
  {
    title: "AI Agent Developer Intern",
    issuer: "The Deft Crew (TDC)",
    year: "10 Jun — 9 Aug 2026",
    url: "/certificates/tdc-ai-agent-internship-2026.png",
  },
  {
    title: "AI Got Talent · Certificate of Participation",
    issuer: "ACM Developers Day ’26 · FAST NUCES Karachi",
    year: "30 Apr 2026",
    url: "/certificates/ai-got-talent-2026.pdf",
  },
  {
    title: "Game Development in Unity",
    issuer: "Microsoft Learn Student Ambassadors",
    year: "",
    url: "/certificates/game-development-unity.pdf",
  },
  {
    title: "6-Week Summer Internship · Web Portal Development",
    issuer: "MUET FM 92.6",
    year: "15 May — 30 Jun 2025",
    url: "/certificates/muet-fm-internship-2025.pdf",
  },
];
export type Achievement = {
  label: string;
  caption: string;
  detail: string;
  value: number;
  suffix: string;
  logo?: string;
};
export const ACHIEVEMENTS: Achievement[] = []; // No standalone achievements in the supplied résumé.
export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  ...(ACHIEVEMENTS.length
    ? [{ id: "achievements", label: "Achievements" }]
    : []),
  { id: "contact", label: "Contact" },
];
export const COPY = {
  hero: {
    eyebrow: "Agentic AI & LLM Systems",
    heading: "AI",
    accent: "Engineer.",
    note: ["Python. FastAPI.", "LLM-powered applications."],
    explore: "Explore work",
    talk: "Let’s talk",
    resume: "Résumé ↓",
    scroll: "Scroll to explore",
    petLabel: "Chat with Robo Cat about Anees",
    petHint: "Tap to ask about me",
    petHappy: "Hello, friend.",
    petPause: "Pause pet animation",
    petPlay: "Resume pet animation",
    videoLabel: "Self-introduction by Muhammad Anees",
    soundOn: "Pause introduction audio",
    soundOff: "Play introduction with audio",
    motionPause: "Pause introduction video",
    motionPlay: "Play introduction video",
  },
  about: {
    tag: "A little about me",
    heading: "Hi, I’m",
    accent: "Anees.",
    facts: "Quick facts",
    education: "Education",
    role: "Current role",
    email: "Email",
    cardFront: "DEVELOPER ID",
    cardBack: "What I am",
    flip: "Flip identification card",
    graduation: "Graduation",
    hello: "If found, say hello",
    resume: "Résumé",
    github: "GitHub",
    linkedin: "LinkedIn",
  },
  skills: {
    tag: "The toolkit",
    heading: "A capability deck",
    accent: "built to ship.",
    all: "All skills",
    inspector: "Selected capability",
    used: "In selected work",
    empty: "Listed in technical skills",
    hint: "Choose a discipline, then explore each capability.",
  },
  work: {
    tag: "Selected work",
    heading: "Things I’ve",
    accent: "built.",
    intro:
      "LLM-powered applications, RAG systems, and multi-model AI services.",
    github: "View on GitHub ↗",
    demo: "Live demo ↗",
    illustration: "Illustrative UI",
    labels: {
      resume: [
        "AI Resume Builder",
        "Role-specific rewriting",
        "ATS scoring",
        "PDF generation",
      ],
      career: ["AI Career Assistant", "Job recommendations", "Career roadmaps"],
      chat: ["TDC AI Chat Service", "Intelligent routing", "Knowledge sync"],
      travel: [
        "Pakistan Travel RAG System",
        "Destinations",
        "Hotels",
        "Activities",
      ],
      legal: [
        "Pakistani Legal Assistant",
        "Source attribution",
        "Confidence scoring",
      ],
      plan: ["Plot2Plan AI", "35 × 70 ft plot", "Ground floor concept"],
    },
  },
  certifications: {
    tag: "Certificates & credentials",
    heading: "Always",
    accent: "learning.",
    count: "verified records",
  },
  experience: {
    tag: "The path so far",
    heading: "Learning. Building.",
    accent: "Growing.",
    next: "Next — Your team?",
  },
  achievements: {
    tag: "Achievements",
    heading: "A little",
    accent: "momentum.",
    end: "and counting →",
  },
  contact: {
    tag: "Start a conversation",
    heading: "Let’s build",
    accent: "something together.",
    copy: "Copy",
    copied: "Copied ✓",
    copyError: "Copy unavailable — select the email to copy.",
    hello: "SAY HELLO · SAY HELLO · ",
    back: "Back to top ↑",
    credit: "Built with Next.js",
  },
  ui: {
    menu: "Menu",
    close: "Close",
    skip: "Skip to content",
    top: "Back to top",
    external: "opens in a new tab",
    openProject: "Open project",
    selectedProject: "Selected project",
  },
} as const;

export const CHAT = {
  title: "Ask Robo Cat",
  subtitle: "AI assistant · answers from Anees’s verified portfolio",
  intro:
    "Hi! I’m Robo Cat, an AI assistant for Anees’s portfolio. Ask me anything about his AI engineering work, projects, skills, or how he could help your team.",
  placeholder: "Ask about Anees’s work…",
  inputLabel: "Your question about Anees",
  send: "Send message",
  stop: "Stop generating",
  retry: "Retry",
  stopped: "Generation stopped.",
  error: "I couldn’t reach the assistant. Check your connection and retry.",
  close: "Close chat",
  clear: "New chat",
  latest: "Jump to latest message",
  thinking: "Robo Cat is thinking",
  privacy:
    "AI-generated from Anees’s portfolio and may contain mistakes. Messages are sent to an AI provider and not stored by this site.",
  suggestions: [
    "What AI engineering experience does he have?",
    "Explain his RAG projects",
    "Can he build a chatbot for my company?",
    "Is he a fit for a junior AI engineer role?",
  ],
  maxChars: 800,
  limit: "Please keep your message under 800 characters.",
} as const;
