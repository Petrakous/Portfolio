import type { SignalId } from "./site-copy";

export type PortfolioCard = {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  evidence?: string;
  image?: string;
  imageAlt?: string;
  tags: string[];
  group: string;
  links?: { label: string; href: string }[];
};

export type PortfolioSection = {
  id: SignalId;
  label: string;
  title: string;
  intro: string;
  href: string;
  side: "left" | "right";
  cards: PortfolioCard[];
};

const demoImages = {
  code: "https://images.unsplash.com/photo-1753998943918-dd2dfc4ee6ed?auto=format&fit=crop&w=1200&q=78",
  graduation: "https://images.unsplash.com/photo-1623461487986-9400110de28e?auto=format&fit=crop&w=1200&q=78",
  gaming: "https://images.unsplash.com/photo-1679456690102-f9fe4a195029?auto=format&fit=crop&w=1200&q=78",
  snowboard: "https://images.unsplash.com/photo-1676823648066-01a3e8db31c2?auto=format&fit=crop&w=1200&q=78",
  servers: "https://images.unsplash.com/photo-1695668548342-c0c1ad479aee?auto=format&fit=crop&w=1200&q=78",
  coffee: "https://images.unsplash.com/photo-1757495153477-85b2340f4f82?auto=format&fit=crop&w=1200&q=78",
  hiking: "https://images.unsplash.com/photo-1647784392545-de4e422114f7?auto=format&fit=crop&w=1200&q=78",
  cinema: "https://images.unsplash.com/photo-1762541693135-fb989de961e1?auto=format&fit=crop&w=1200&q=78",
} as const;

export const portfolioSections: PortfolioSection[] = [
  {
    id: "knowledge",
    label: "Knowledge",
    title: "Knowledge, with evidence",
    intro: "Skills connected to the systems and teams where they were learned.",
    href: "/knowledge",
    side: "right",
    cards: [
      { id: "computer-vision", title: "Computer Vision", kicker: "Models → useful review", summary: "Annotation, segmentation, evaluation and visual QA for research datasets.", evidence: "TRIFFID · Aerial Detection Atlas", image: demoImages.code, imageAlt: "Code displayed on a research workstation", tags: ["CV", "QA", "Annotation"], group: "Technical domains" },
      { id: "spatial-web", title: "3D Web Systems", kicker: "Capture → browser", summary: "Interactive viewers for GLB scenes, Gaussian splats and spatial navigation.", evidence: "3DHUA · viewer experiments", image: "/media/3dhua-main-hall.webp", imageAlt: "Browser-based 3D campus scene", tags: ["Three.js", "WebGL", "3DGS"], group: "Technical domains" },
      { id: "research-data", title: "Research Data Tooling", kicker: "Source → traceable dataset", summary: "Media ingestion, frame selection, crop audit, manifests and repeatable exports.", evidence: "TRIFFID Review Studio", image: "/media/triffid-crop-audit.png", imageAlt: "Research dataset crop audit interface", tags: ["Python", "FFmpeg", "OpenCV"], group: "Technical domains" },
      { id: "software-systems", title: "Software Systems", kicker: "Interfaces → services", summary: "Backend, distributed and containerised systems built around real workflows.", evidence: "StudyRooms · Spark analytics", image: demoImages.servers, imageAlt: "Network and server infrastructure", tags: ["Java", "Docker", "REST"], group: "Technical domains" },
      { id: "communication", title: "Communication", kicker: "Service under pressure", summary: "Clear communication, presentation and teamwork developed across research and hospitality.", evidence: "Research team · hospitality roles", image: demoImages.coffee, imageAlt: "Barista working with an espresso machine", tags: ["Teams", "Service", "Presentation"], group: "Human practice" },
      { id: "adaptability", title: "Adaptability", kicker: "Different environments, same standard", summary: "Practical problem-solving shaped by technical retail, service and hands-on work.", evidence: "Plaisio · events · moving crews", image: demoImages.hiking, imageAlt: "People hiking along a mountain trail", tags: ["Operations", "Learning", "Delivery"], group: "Human practice" },
    ],
  },
  {
    id: "research",
    label: "Credentials",
    title: "Credentials & milestones",
    intro: "A short record of education, language proficiency and current research responsibility.",
    href: "/credentials",
    side: "left",
    cards: [
      { id: "research-associate", title: "Research Associate", kicker: "2025 → now", summary: "Dataset pipelines, annotation, curation and QA in the EU Horizon Europe TRIFFID project.", image: "/media/triffid-frame-selection.png", imageAlt: "TRIFFID research review interface", tags: ["TRIFFID", "Computer Vision"], group: "Current" },
      { id: "harokopio", title: "Informatics & Telematics", kicker: "Harokopio University", summary: "Undergraduate study alongside research software and Computer Vision Group collaboration.", image: "/media/3dhua-campus.webp", imageAlt: "University campus from above", tags: ["BSc", "Athens"], group: "Education" },
      { id: "it-diploma", title: "IT Applications Technician", kicker: "Technical diploma · 18.9/20", summary: "Programming, computer hardware and networking, completed with an Excellent grade.", image: demoImages.code, imageAlt: "Programming code on a monitor", tags: ["Programming", "Networks"], group: "Education" },
      { id: "school-diploma", title: "Technical High School", kicker: "Graduation · 18.7/20", summary: "Technical informatics pathway completed with Excellent conduct and overall grade.", image: demoImages.graduation, imageAlt: "Graduate wearing academic dress", tags: ["Informatics", "Foundation"], group: "Education" },
      { id: "english-c2", title: "English Proficiency", kicker: "Michigan · C2", summary: "Professional working proficiency aligned with CEFR C2.", image: demoImages.graduation, imageAlt: "Academic graduation moment", tags: ["English", "Communication"], group: "Languages" },
    ],
  },
  {
    id: "work",
    label: "Work",
    title: "Selected work",
    intro: "Research tools, spatial interfaces and systems — followed by a small, honest archive.",
    href: "/work",
    side: "right",
    cards: [
      { id: "3dhua", title: "3DHUA", kicker: "Spatial computing", summary: "A browser-native campus experience combining 3D scenes, Gaussian splats and progressive delivery.", image: "/media/3dhua-campus.webp", imageAlt: "3DHUA campus reconstruction", tags: ["3D Web", "3DGS"], group: "Flagship work", links: [{ label: "View repository", href: "https://github.com/Petrakous/Hua-3D-Showcase" }] },
      { id: "aerial-atlas", title: "Aerial Detection Atlas", kicker: "Computer Vision", summary: "An interactive surface for comparing ground truth with model detections across aerial datasets.", image: "/media/aerial-detection.jpg", imageAlt: "Aerial model detection preview", tags: ["Evaluation", "Visual QA"], group: "Flagship work", links: [{ label: "View repository", href: "https://github.com/Petrakous/Aerial-Detection-Atlas" }] },
      { id: "triffid-review", title: "TRIFFID Review Studio", kicker: "Research operations", summary: "An end-to-end workflow for source review, frame selection, crop audit and traceable exports.", image: "/media/triffid-frame-selection.png", imageAlt: "TRIFFID frame review interface", tags: ["Curation", "Automation"], group: "Flagship work" },
      { id: "studyrooms", title: "StudyRooms", kicker: "Distributed systems", summary: "A reservation platform exploring Spring services, authentication, persistence and multi-process delivery.", image: demoImages.servers, imageAlt: "Server rack and network infrastructure", tags: ["Spring Boot", "REST", "Docker"], group: "Systems & university" },
      { id: "chicago-data", title: "Chicago Crime Analytics", kicker: "Data systems", summary: "A 1.99 GB analysis workflow carried from pandas into Docker and a Spark master/worker cluster.", image: demoImages.code, imageAlt: "Data code displayed on a monitor", tags: ["Spark", "Parquet", "Docker"], group: "Systems & university" },
      { id: "pacman-search", title: "Pacman Search", kicker: "AI coursework", summary: "Search and decision strategies implemented and evaluated in a visual Pacman environment.", image: demoImages.gaming, imageAlt: "Game controller in blue light", tags: ["AI", "Search", "Python"], group: "Systems & university" },
      { id: "socket-games", title: "Networked Games", kicker: "Early years", summary: "Client/server Rock–Paper–Scissors and socket experiments that made networking tangible.", image: demoImages.gaming, imageAlt: "Game controller representing networked games", tags: ["Sockets", "Threads", "Python"], group: "Early years" },
      { id: "security-lab", title: "Network Control Lab", kicker: "Early security experiments", summary: "Early client/server and traffic-load prototypes, retained as controlled learning artifacts rather than production tools.", image: demoImages.servers, imageAlt: "Network server rack", tags: ["Networking", "Security", "Ethics"], group: "Early years" },
      { id: "hospitality", title: "Hospitality & Events", kicker: "Unrelated work, related skills", summary: "Fast service, teamwork and customer communication across high-pressure hospitality environments.", image: demoImages.coffee, imageAlt: "Barista preparing coffee", tags: ["Service", "Teams"], group: "Other experience" },
      { id: "tech-retail", title: "Technology Retail", kicker: "Plaisio Computers", summary: "Customer-facing hardware, laptop and mobile guidance grounded in practical product knowledge.", image: demoImages.code, imageAlt: "Technology workstation display", tags: ["Hardware", "Communication"], group: "Other experience" },
      { id: "hands-on", title: "Hands-on Crews", kicker: "Moving · painting · maintenance", summary: "Physical, practical work that reinforced reliability, adaptation and respect for operational detail.", image: demoImages.hiking, imageAlt: "People moving together along a mountain trail", tags: ["Operations", "Reliability"], group: "Other experience" },
    ],
  },
  {
    id: "about",
    label: "About",
    title: "Outside the interface",
    intro: "A concise view of what shapes the person behind the work.",
    href: "/about",
    side: "right",
    cards: [
      { id: "now", title: "Now", kicker: "Athens · research + development", summary: "Studying Informatics & Telematics while building tools for computer-vision research and 3D delivery.", image: "/media/3dhua-campus.webp", imageAlt: "Campus environment in Athens", tags: ["Athens", "HUA"], group: "Profile" },
      { id: "gaming", title: "Gaming", kicker: "Systems through play", summary: "A long-running interest in interactive systems, mechanics and the small details that make experiences feel responsive.", image: demoImages.gaming, imageAlt: "Game controller in atmospheric blue light", tags: ["Games", "Interaction"], group: "Interests" },
      { id: "mountains", title: "Snow & Mountains", kicker: "Movement outside the screen", summary: "Snowboarding, hiking and training provide the useful opposite of long technical sessions.", image: demoImages.snowboard, imageAlt: "Snowboarder carving down a mountain slope", tags: ["Snowboard", "Hiking"], group: "Interests" },
      { id: "travel-film", title: "Travel & Film", kicker: "New places, different frames", summary: "Travel and cinema feed visual curiosity, observation and a preference for strong atmosphere.", image: demoImages.cinema, imageAlt: "Projector light in a dark cinema", tags: ["Travel", "Film"], group: "Interests" },
      { id: "practical", title: "Practical Background", kicker: "Service · retail · manual work", summary: "A varied work history keeps the engineering grounded in people, constraints and delivery.", image: demoImages.coffee, imageAlt: "Hands-on work at an espresso machine", tags: ["People", "Practice"], group: "Profile" },
    ],
  },
];

export const getPortfolioSection = (id: SignalId) => portfolioSections.find((section) => section.id === id)!;
