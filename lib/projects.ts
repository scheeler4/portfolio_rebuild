// ---------------------------------------------------------------------------
// Static project + about data
// ---------------------------------------------------------------------------
// This is real content migrated from johnscheeler.com. Edit this file
// directly to add, remove, or update projects -- no CMS required.
// ---------------------------------------------------------------------------

export interface ProjectImage {
  url: string
  alt?: string
}

export interface Project {
  slug: string
  title: string
  subtitle?: string
  description: string
  thumbnail: ProjectImage
  skills: string[]
  role?: string
  organization?: string
  award?: string
  tools?: string[]
  content: string[]
  images: ProjectImage[]
  video?: { type: "youtube"; url: string; caption?: string }
  featured?: boolean
  order: number
}

export const projects: Project[] = [
  {
    slug: "archiarbiter",
    title: "ArchiArbiter",
    subtitle: "Cornell Architectural Thesis — Massing Tool",
    description:
      "A tool that enables algorithmic-aided design for architectural massing, letting users author rules that apply dynamically to selected volumes.",
    thumbnail: { url: "/projects/archiarbiter/1.jpeg", alt: "ArchiArbiter massing tool interface" },
    skills: ["Architecture", "Prototyping"],
    role: "Co-creator",
    organization: "Cornell University — Architectural Thesis",
    tools: ["Front End Web Development", "Rhino 6 + Grasshopper"],
    content: [
      "ArchiArbiter is a tool that enables algorithmic-aided design for architectural massing. The software allows users to create rules that can then be applied dynamically to selected volumes.",
      "This work was a collaboration between Jeff Drexel and myself as part of my architectural thesis at Cornell University, exploring how rule-based systems can accelerate and inform early-stage massing decisions.",
    ],
    images: [
      { url: "/projects/archiarbiter/1.jpeg" },
      { url: "/projects/archiarbiter/2.jpeg" },
      { url: "/projects/archiarbiter/3.jpeg" },
      { url: "/projects/archiarbiter/4.jpeg" },
    ],
    featured: true,
    order: 1,
  },
  {
    slug: "scout",
    title: "Scout",
    subtitle: "KPF Urban Interface — Design Viewer",
    description:
      "A full-cycle design review product that lets teams explore thousands of potential building configurations in a simple, accessible interface.",
    thumbnail: { url: "/projects/scout/1.jpeg", alt: "Scout design viewer interface" },
    skills: ["Architecture", "Prototyping"],
    role: "Product Designer & Developer",
    organization: "Kohn Pedersen Fox — Urban Interface Team",
    award: "Fast Company — Data Design category, 2020 Innovation by Design Awards",
    tools: ["Front End Web Development", "Rhino 6 + Grasshopper", "Adobe Suite (XD, InDesign, Illustrator, Photoshop)"],
    content: [
      "Scout started as my internship project while working on the UI team at KPF. Since its inception, Scout has grown into a fully featured product, supporting full cycle design review for numerous active projects.",
      "Scout enables users to explore design spaces with thousands of potential configurations in a simple and easy-to-access manner, bridging computational design output with client-facing communication.",
    ],
    images: [{ url: "/projects/scout/1.jpeg" }, { url: "/projects/scout/2.jpeg" }],
    featured: true,
    order: 2,
  },
  {
    slug: "ubiquiti",
    title: "AmpliFi Alien Analysis",
    subtitle: "Ubiquiti Labs — UX Review",
    description:
      "A complete review of the Alien router's interfaces, software tools, and setup experience to identify opportunities for improvement.",
    thumbnail: { url: "/projects/ubiquiti/1.jpeg", alt: "AmpliFi Alien router UX analysis" },
    skills: ["UI/UX Design"],
    role: "UX Researcher & Designer",
    organization: "Ubiquiti Labs",
    tools: ["Adobe Suite (XD, InDesign, Illustrator, Photoshop)"],
    content: [
      "The Alien router offers many user-centered features not common on most WiFi products. I conducted a complete review of the current interfaces, software tools, and setup experience to identify potential opportunities for improvement.",
      "The output included concrete experience improvements alongside a set of proposed new features grounded in observed user pain points.",
    ],
    images: [
      { url: "/projects/ubiquiti/1.jpeg" },
      { url: "/projects/ubiquiti/2.jpeg" },
      { url: "/projects/ubiquiti/3.jpeg" },
      { url: "/projects/ubiquiti/4.jpeg" },
    ],
    featured: true,
    order: 3,
  },
  {
    slug: "utap",
    title: "Strategic Opportunity Assessment",
    subtitle: "United Technology Advanced Projects (UTAP)",
    description:
      "A strategic assessment exploring opportunities and synergies within the smart infrastructure space to develop new products and long-term development pathways.",
    thumbnail: { url: "/projects/utap/1.jpeg", alt: "UTAP strategic opportunity assessment" },
    skills: ["Prototyping"],
    role: "Strategy Consultant",
    organization: "United Technology Advanced Projects",
    content: [
      "The UTAP team was interested in exploring potential opportunities and synergies with their existing business interests in the smart infrastructure space to develop new products and long-term development opportunities.",
      "The work involved consulting numerous industry and academic experts while developing the proposal, culminating in a set of market-backed recommendations.",
    ],
    images: [
      { url: "/projects/utap/1.jpeg" },
      { url: "/projects/utap/2.jpeg" },
      { url: "/projects/utap/3.jpeg" },
      { url: "/projects/utap/4.jpeg" },
    ],
    order: 4,
  },
  {
    slug: "invisible-interfaces",
    title: "Invisible Interfaces",
    subtitle: "Documenting Cybernetics in Architectural Space",
    description:
      "A multifaceted research and design project documenting the evolution of cybernetics and how invisible interfaces shape our interactions with built environments.",
    thumbnail: { url: "/projects/invisible-interfaces/2.jpg", alt: "Invisible Interfaces smart office concept" },
    skills: ["UI/UX Design", "Architecture"],
    role: "Researcher & Designer",
    organization: "Cornell University — ART 3092",
    content: [
      "In documenting the invisible interfaces that we interact with in architectural environments, I believe a multifaceted output helps deliver the narrative of the evolution of cybernetics and our interactions within these built spaces.",
      "The project began with research tying cybernetics to architectural spaces, using wiring-diagram documentation styles as precedent for visual networks. Inspired in part by Wall++ research from CMU, the work simulated traffic through a space to identify connectivity opportunities.",
      "This process was repeated five times to produce a series of future interfaces between oneself and the architectural environment: the invisible interface.",
    ],
    images: [
      { url: "/projects/invisible-interfaces/1.png" },
      { url: "/projects/invisible-interfaces/2.jpg" },
      { url: "/projects/invisible-interfaces/3.jpg" },
      { url: "/projects/invisible-interfaces/4.jpg" },
    ],
    order: 5,
  },
  {
    slug: "vr-interfaces",
    title: "Interfaces for Virtual Reality",
    subtitle: "Autodesk Office of the CTO (OCTO)",
    description:
      "Exploring interfaces for interacting within virtual reality environments, bringing Autodesk product suite functionality into VR.",
    thumbnail: { url: "/projects/vr-interfaces/1.jpeg", alt: "Autodesk VR interface prototype" },
    skills: ["Virtual Reality"],
    role: "VR Design Intern",
    organization: "Autodesk — Office of the CTO",
    tools: ["Stingray Game Engine"],
    content: [
      "While working in the Stingray game engine, our team explored numerous interfaces for interacting with virtual reality environments.",
      "These experiments aimed to bring functionalities found across the Autodesk product suite and traditional 3D tools into the VR space, testing a range of interface elements for spatial interaction.",
    ],
    images: [
      { url: "/projects/vr-interfaces/1.jpeg" },
      { url: "/projects/vr-interfaces/2.jpeg" },
      { url: "/projects/vr-interfaces/3.jpeg" },
      { url: "/projects/vr-interfaces/4.jpeg" },
    ],
    order: 6,
  },
]

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => a.order - b.order)
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

// ---------------------------------------------------------------------------
// About page content
// ---------------------------------------------------------------------------

export interface WorkExperience {
  organization: string
  description: string
}

export const workExperience: WorkExperience[] = [
  {
    organization: "Keystone Strategy",
    description:
      "Worked on numerous high-impact strategy and digital transformation projects for clients such as Facebook, Microsoft, Oracle, and Dow Jones.",
  },
  {
    organization: "Kohn Pedersen Fox — Urban Interface",
    description:
      "Worked on the Urban Interface team, contracted for the urban design and interface simulations of the Waterfront Toronto project by Sidewalk Labs.",
  },
  {
    organization: "Tesla",
    description:
      "Worked on the Special Projects team based in Fremont, CA on numerous sprint-based projects to solve pressing operations issues.",
  },
  {
    organization: "Google",
    description:
      "Worked on a five-person team within the ATAP (Advanced Technology and Projects) group on Project Ara, specializing in UX/UI design.",
  },
  {
    organization: "Autodesk",
    description:
      "Worked on a team of four interns specializing in VR interfaces within the Office of the CTO.",
  },
]

export const coreTenets = [
  {
    title: "Strategy",
    description:
      "I love thinking about how things work as systems, and find that my interdisciplinary work experience provides valuable insights that drive transformative strategies. I strive to combine rigorous data analysis with deep fundamental research.",
  },
  {
    title: "Prototyping",
    description:
      "Prototyping is driven by the necessity to create and solve everyday problems. I've found that the ability to create, in many different mediums, has proven vital in conveying ideas and generating buy-in.",
  },
  {
    title: "User Experience",
    description:
      "People are the most important aspect of a product or design. The key to success is their satisfaction. I strive to create solutions that solve problems and change lives.",
  },
  {
    title: "Environmental Design",
    description:
      "I graduated from Cornell University with a B.Arch and have always had a passion for architecture and the built environment. I've worked on numerous smart spaces projects, ranging from complex urban environments to interactive exhibits.",
  },
]

export const contactEmail = "john.scheeler44@gmail.com"
