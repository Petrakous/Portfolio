export type Project = {
  id: string;
  index: string;
  title: string;
  eyebrow: string;
  summary: string;
  description: string;
  contribution: string;
  tags: string[];
  facts: string[];
  lab: {
    input: string;
    runtime: string;
    delivery: string;
    focus: string;
  };
  image?: string;
  imageAlt?: string;
  repo?: string;
  live?: string;
  tone: "space" | "vision" | "pipeline";
};

export const projects: Project[] = [
  {
    id: "3dhua",
    index: "01",
    title: "3DHUA",
    eyebrow: "Flagship · spatial computing",
    summary: "A browser-native campus experience built from real capture data.",
    description:
      "An interactive 3D showcase for Harokopio University, combining classic GLB meshes and Gaussian splats with progressive loading, scene-specific navigation, recovery states, and a lightweight gallery path.",
    contribution:
      "Viewer architecture, scene systems, asset pipeline, first-person navigation, collision, LOD strategy, cutaway tooling, and delivery polish.",
    tags: ["Three.js", "PlayCanvas", "WebGL", "GLB", "Gaussian splats", "LOD"],
    facts: ["GLB + SOG rendering", "Walk / fly / orbit", "Cloudflare R2 asset delivery"],
    lab: {
      input: "GLB meshes · SOG splats · camera presets",
      runtime: "PlayCanvas + browser-native JavaScript",
      delivery: "Static shell + progressive R2 assets",
      focus: "LOD, collision, recovery, navigation",
    },
    image: "/media/3dhua-campus.webp",
    imageAlt: "Gaussian-splat aerial view of the Harokopio University campus",
    repo: "https://github.com/Petrakous/Hua-3D-Showcase",
    live: "https://petrakous.github.io/Hua-3D-Showcase/",
    tone: "space",
  },
  {
    id: "aerial-atlas",
    index: "02",
    title: "Aerial Detection Atlas",
    eyebrow: "Research interface · computer vision",
    summary: "Ground truth and model predictions made explorable, side by side.",
    description:
      "A static benchmark viewer that turns detection and segmentation exports into an interactive comparison surface across datasets and models, with overlay, split, focus, and raw-image modes.",
    contribution:
      "Data ingestion, JSON generation, comparison UX, model/dataset navigation, annotation rendering, and an interface tuned for visual QA.",
    tags: ["Computer Vision", "JavaScript", "JSON", "Evaluation", "Segmentation", "QA"],
    facts: ["GT / prediction comparison", "Multiple model families", "No-build static delivery"],
    lab: {
      input: "Images · GT JSON · prediction JSON",
      runtime: "Static JavaScript annotation renderer",
      delivery: "GitHub Pages · no build step",
      focus: "Visual QA, comparison, dataset navigation",
    },
    image: "/media/aerial-detection.jpg",
    imageAlt: "Smoke detection result with a model bounding box and confidence score",
    repo: "https://github.com/Petrakous/Aerial-Detection-Atlas",
    live: "https://petrakous.github.io/Aerial-Detection-Atlas/",
    tone: "vision",
  },
  {
    id: "triffid-review",
    index: "03",
    title: "TRIFFID Review Studio",
    eyebrow: "Research tooling · dataset operations",
    summary: "A human-in-the-loop workspace for turning video into curated evidence.",
    description:
      "An end-to-end research workflow for source review, scene and frame selection, crop refinement, manifest-backed decisions, and repeatable exports supporting computer-vision dataset production.",
    contribution:
      "Workflow design, media ingestion, annotation and curation interfaces, quality-assurance states, crop audit tools, automation, and export packaging.",
    tags: ["Python", "FFmpeg", "OpenCV", "Data curation", "Annotation", "Automation"],
    facts: ["Source → selection → audit", "Manifest-backed review state", "Human QA at every stage"],
    lab: {
      input: "Video sources · manifests · review state",
      runtime: "Python · FFmpeg · OpenCV · web UI",
      delivery: "Local review workspace + packaged exports",
      focus: "Traceability, curation, crop quality",
    },
    image: "/media/triffid-frame-selection.png",
    imageAlt: "TRIFFID Review Studio frame-selection interface",
    tone: "pipeline",
  },
];

export const skillDomains = [
  {
    title: "3D / Web graphics",
    skills: "JavaScript · WebGL · GLB · Gaussian splats · LOD",
    evidence: "3DHUA and browser viewer experiments",
    project: "3dhua",
  },
  {
    title: "Computer vision",
    skills: "Annotation · segmentation · evaluation · visual QA",
    evidence: "Aerial Detection Atlas and TRIFFID research work",
    project: "aerial-atlas",
  },
  {
    title: "Research data tooling",
    skills: "Python · FFmpeg · OpenCV · manifests · automation",
    evidence: "TRIFFID Review Studio and dataset pipelines",
    project: "triffid-review",
  },
];

export const searchItems = [
  ...projects.map((project) => ({
    label: project.title,
    kind: "Project",
    detail: project.tags.join(" · "),
    target: project.id,
    keywords: `${project.title} ${project.tags.join(" ")} ${project.description}`,
  })),
  ...skillDomains.map((domain) => ({
    label: domain.title,
    kind: "Knowledge",
    detail: domain.evidence,
    target: domain.project,
    keywords: `${domain.title} ${domain.skills} ${domain.evidence}`,
  })),
  {
    label: "Research Associate · TRIFFID",
    kind: "Experience",
    detail: "Dataset pipelines, annotation, QA, curation, image and video workflows",
    target: "experience",
    keywords: "research associate horizon europe triffid computer vision dataset curation",
  },
  {
    label: "Informatics & Telematics",
    kind: "Education",
    detail: "Harokopio University of Athens",
    target: "experience",
    keywords: "education university harokopio informatics telematics",
  },
  {
    label: "English proficiency · C2",
    kind: "Credential",
    detail: "Michigan English Language Proficiency",
    target: "experience",
    keywords: "english c2 credential michigan",
  },
];
