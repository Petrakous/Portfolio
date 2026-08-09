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

export const portfolioSections: PortfolioSection[] = [
  {
    id: "knowledge",
    label: "Knowledge",
    title: "Knowledge, with evidence",
    intro: "Skills connected to the systems and teams where they were learned.",
    href: "/knowledge",
    side: "right",
    cards: [
      { id: "computer-vision", title: "Computer Vision", kicker: "Models → useful review", summary: "Annotation, segmentation, evaluation and visual QA for research datasets.", evidence: "TRIFFID · Aerial Detection Atlas", tags: ["CV", "QA", "Annotation"], group: "Technical domains" },
      { id: "spatial-web", title: "3D Web Systems", kicker: "Capture → browser", summary: "Interactive viewers for GLB scenes, Gaussian splats and spatial navigation.", evidence: "3DHUA · viewer experiments", tags: ["Three.js", "WebGL", "3DGS"], group: "Technical domains" },
      { id: "research-data", title: "Research Data Tooling", kicker: "Source → traceable dataset", summary: "Media ingestion, frame selection, crop audit, manifests and repeatable exports.", evidence: "TRIFFID Review Studio", tags: ["Python", "FFmpeg", "OpenCV"], group: "Technical domains" },
      { id: "software-systems", title: "Software Systems", kicker: "Interfaces → services", summary: "Backend, distributed and containerised systems built around real workflows.", evidence: "StudyRooms · Spark analytics", tags: ["Java", "Docker", "REST"], group: "Technical domains" },
      { id: "communication", title: "Communication", kicker: "Service under pressure", summary: "Clear communication, presentation and teamwork developed across research and hospitality.", evidence: "Research team · hospitality roles", tags: ["Teams", "Service", "Presentation"], group: "Human practice" },
      { id: "adaptability", title: "Adaptability", kicker: "Different environments, same standard", summary: "Practical problem-solving shaped by technical retail, service and hands-on work.", evidence: "Plaisio · events · moving crews", tags: ["Operations", "Learning", "Delivery"], group: "Human practice" },
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
      { id: "research-associate", title: "Research Associate", kicker: "2025 → now", summary: "Dataset pipelines, annotation, curation and QA in the EU Horizon Europe TRIFFID project.", tags: ["TRIFFID", "Computer Vision"], group: "Current" },
      { id: "harokopio", title: "Informatics & Telematics", kicker: "Harokopio University", summary: "Undergraduate study alongside research software and Computer Vision Group collaboration.", tags: ["BSc", "Athens"], group: "Education" },
      { id: "it-diploma", title: "IT Applications Technician", kicker: "Technical diploma · 18.9/20", summary: "Programming, computer hardware and networking, completed with an Excellent grade.", tags: ["Programming", "Networks"], group: "Education" },
      { id: "school-diploma", title: "Technical High School", kicker: "Graduation · 18.7/20", summary: "Technical informatics pathway completed with Excellent conduct and overall grade.", tags: ["Informatics", "Foundation"], group: "Education" },
      { id: "english-c2", title: "English Proficiency", kicker: "Michigan · C2", summary: "Professional working proficiency aligned with CEFR C2.", tags: ["English", "Communication"], group: "Languages" },
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
      { id: "3dhua", title: "3DHUA", kicker: "Spatial computing", summary: "A browser-native campus experience combining 3D scenes, Gaussian splats and progressive delivery.", image: "/media/3dhua-campus.webp", imageAlt: "3DHUA campus reconstruction", tags: ["3D Web", "3DGS"], group: "Flagship work" },
      { id: "aerial-atlas", title: "Aerial Detection Atlas", kicker: "Computer Vision", summary: "An interactive surface for comparing ground truth with model detections across aerial datasets.", image: "/media/aerial-detection.jpg", imageAlt: "Aerial model detection preview", tags: ["Evaluation", "Visual QA"], group: "Flagship work" },
      { id: "triffid-review", title: "TRIFFID Review Studio", kicker: "Research operations", summary: "An end-to-end workflow for source review, frame selection, crop audit and traceable exports.", image: "/media/triffid-frame-selection.png", imageAlt: "TRIFFID frame review interface", tags: ["Curation", "Automation"], group: "Flagship work" },
      { id: "studyrooms", title: "StudyRooms", kicker: "Distributed systems", summary: "A reservation platform exploring Spring services, authentication, persistence and multi-process delivery.", tags: ["Spring Boot", "REST", "Docker"], group: "Systems & university" },
      { id: "chicago-data", title: "Chicago Crime Analytics", kicker: "Data systems", summary: "A 1.99 GB analysis workflow carried from pandas into Docker and a Spark master/worker cluster.", tags: ["Spark", "Parquet", "Docker"], group: "Systems & university" },
      { id: "pacman-search", title: "Pacman Search", kicker: "AI coursework", summary: "Search and decision strategies implemented and evaluated in a visual Pacman environment.", tags: ["AI", "Search", "Python"], group: "Systems & university" },
      { id: "socket-games", title: "Networked Games", kicker: "Early years", summary: "Client/server Rock–Paper–Scissors and socket experiments that made networking tangible.", tags: ["Sockets", "Threads", "Python"], group: "Early years" },
      { id: "security-lab", title: "Network Control Lab", kicker: "Early security experiments", summary: "Early client/server and traffic-load prototypes, retained as controlled learning artifacts rather than production tools.", tags: ["Networking", "Security", "Ethics"], group: "Early years" },
      { id: "hospitality", title: "Hospitality & Events", kicker: "Unrelated work, related skills", summary: "Fast service, teamwork and customer communication across high-pressure hospitality environments.", tags: ["Service", "Teams"], group: "Other experience" },
      { id: "tech-retail", title: "Technology Retail", kicker: "Plaisio Computers", summary: "Customer-facing hardware, laptop and mobile guidance grounded in practical product knowledge.", tags: ["Hardware", "Communication"], group: "Other experience" },
      { id: "hands-on", title: "Hands-on Crews", kicker: "Moving · painting · maintenance", summary: "Physical, practical work that reinforced reliability, adaptation and respect for operational detail.", tags: ["Operations", "Reliability"], group: "Other experience" },
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
      { id: "now", title: "Now", kicker: "Athens · research + development", summary: "Studying Informatics & Telematics while building tools for computer-vision research and 3D delivery.", tags: ["Athens", "HUA"], group: "Profile" },
      { id: "gaming", title: "Gaming", kicker: "Systems through play", summary: "A long-running interest in interactive systems, mechanics and the small details that make experiences feel responsive.", tags: ["Games", "Interaction"], group: "Interests" },
      { id: "mountains", title: "Snow & Mountains", kicker: "Movement outside the screen", summary: "Snowboarding, hiking and training provide the useful opposite of long technical sessions.", tags: ["Snowboard", "Hiking"], group: "Interests" },
      { id: "travel-film", title: "Travel & Film", kicker: "New places, different frames", summary: "Travel and cinema feed visual curiosity, observation and a preference for strong atmosphere.", tags: ["Travel", "Film"], group: "Interests" },
      { id: "practical", title: "Practical Background", kicker: "Service · retail · manual work", summary: "A varied work history keeps the engineering grounded in people, constraints and delivery.", tags: ["People", "Practice"], group: "Profile" },
    ],
  },
];

export const getPortfolioSection = (id: SignalId) => portfolioSections.find((section) => section.id === id)!;
