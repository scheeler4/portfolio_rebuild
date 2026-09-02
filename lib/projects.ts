// ---------------------------------------------------------------------------
// Static project + about data
// ---------------------------------------------------------------------------
// This is real content migrated from johnscheeler.com. Edit this file
// directly to add, remove, or update projects -- no CMS required.
// ---------------------------------------------------------------------------

export interface ProjectImage {
  url: string
  alt?: string
  width: number
  height: number
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
    thumbnail: {
      url: "/projects/archiarbiter/1.jpeg",
      alt: "ArchiArbiter massing tool interface",
      width: 2475,
      height: 956,
    },
    skills: ["Architecture", "Prototyping"],
    role: "Co-creator",
    organization: "Cornell University — Architectural Thesis",
    tools: ["Front End Web Development", "Rhino 6 + Grasshopper"],
    content: [
      "ArchiArbiter is a tool that enables algorithmic-aided design for architectural massing. The software allows users to create rules that can then be applied dynamically to selected volumes.",
      "This work was a collaboration between Jeff Drexel and myself as part of my architectural thesis at Cornell University, exploring how rule-based systems can accelerate and inform early-stage massing decisions.",
    ],
    images: Array.from({ length: 16 }, (_, i) => ({
      url: `/projects/archiarbiter/${i + 1}.jpeg`,
      width: 2475,
      height: 956,
    })),
    featured: true,
    order: 1,
  },
  {
    slug: "scout",
    title: "Scout",
    subtitle: "KPF Urban Interface — Design Viewer",
    description:
      "A full-cycle design review product that lets teams explore thousands of potential building configurations in a simple, accessible interface.",
    thumbnail: {
      url: "/projects/scout/1.jpeg",
      alt: "Scout design viewer interface",
      width: 1905,
      height: 1078,
    },
    skills: ["Architecture", "Prototyping"],
    role: "Product Designer & Developer",
    organization: "Kohn Pedersen Fox — Urban Interface Team",
    award: "Fast Company — Data Design category, 2020 Innovation by Design Awards",
    tools: ["Front End Web Development", "Rhino 6 + Grasshopper", "Adobe Suite (XD, InDesign, Illustrator, Photoshop)"],
    content: [
      "Scout started as my internship project while working on the UI team at KPF. Since its inception, Scout has grown into a fully featured product, supporting full cycle design review for numerous active projects.",
      "Scout enables users to explore design spaces with thousands of potential configurations in a simple and easy-to-access manner, bridging computational design output with client-facing communication.",
    ],
    images: [
      { url: "/projects/scout/1.jpeg", width: 1905, height: 1078 },
      { url: "/projects/scout/2.jpeg", width: 1902, height: 1076 },
    ],
    featured: true,
    order: 2,
  },
  {
    slug: "ubiquiti",
    title: "AmpliFi Alien Analysis",
    subtitle: "Ubiquiti Labs — UX Review",
    description:
      "A complete review of the Alien router's interfaces, software tools, and setup experience to identify opportunities for improvement.",
    thumbnail: {
      url: "/projects/ubiquiti/1.jpeg",
      alt: "AmpliFi Alien router UX analysis",
      width: 1912,
      height: 1237,
    },
    skills: ["UI/UX Design"],
    role: "UX Researcher & Designer",
    organization: "Ubiquiti Labs",
    tools: ["Adobe Suite (XD, InDesign, Illustrator, Photoshop)"],
    content: [
      "The Alien router offers many user-centered features not common on most WiFi products. I conducted a complete review of the current interfaces, software tools, and setup experience to identify potential opportunities for improvement.",
      "The output included concrete experience improvements alongside a set of proposed new features grounded in observed user pain points.",
    ],
    images: Array.from({ length: 9 }, (_, i) => ({
      url: `/projects/ubiquiti/${i + 1}.jpeg`,
      width: 1912,
      height: 1237,
    })),
    featured: true,
    order: 3,
  },
  {
    slug: "airbnb-redesign",
    title: "Airbnb Redesign",
    subtitle: "Concept Case Study — Experience-First Discovery",
    description:
      "A speculative redesign exploring how Airbnb's search and landing experience could shift from location-first browsing to experience-first discovery.",
    thumbnail: {
      url: "/projects/airbnb-redesign/1.png",
      alt: "Airbnb redesign concept — experience-first discovery",
      width: 816,
      height: 900,
    },
    skills: ["UI/UX Design"],
    role: "Product Designer",
    organization: "Independent Concept Case Study",
    tools: ["Adobe Suite (XD, InDesign, Illustrator, Photoshop)"],
    content: [
      "People travel out of a desire to explore, to experience, to find something new or different. Airbnb was founded on these principles, as a means to offer people an experience in places hotels couldn't take them — so why is that desire so far removed from the booking process itself?",
      "This concept case study reframes Airbnb's core discovery flow around the question 'What do you want to experience?' rather than 'Where do you want to go?' — surfacing events, seasons, and interests as the entry point into search, instead of destinations.",
      "The redesign carries this idea through a new landing page, an experience-driven home screen, and a search screen that lets users filter directly by interest category, keeping results on a single page while still offering a path to explore further.",
    ],
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/projects/airbnb-redesign/${i + 1}.png`,
      width: 816,
      height: 900,
    })),
    featured: true,
    order: 4,
  },
  {
    slug: "design-analysis",
    title: "Computational Design Tools",
    subtitle: "Optimizing Views + Area Calculator",
    description:
      "A collection of computational tools built to make architectural view and area analysis easier to visualize, interact with, and act on.",
    thumbnail: {
      url: "/projects/design-analysis/1.jpeg",
      alt: "Computational design analysis tools interface",
      width: 1912,
      height: 1237,
    },
    skills: ["Architecture", "Prototyping"],
    role: "Designer & Developer",
    organization: "Independent / Academic Research",
    tools: ["Rhino 6 + Grasshopper"],
    content: [
      "This collection of tools was created to facilitate better design practices within the architectural modeling process. By making data easy to visualize and interact with, the tools remove the technical complexity that often comes with conducting analysis of 3D massings and designs.",
      "The view-optimization workflow measures target views to and from a site — from sidewalks in, and from key buildings out to the surrounding water and skyline — then scores massing options against a template scheme to quantify view improvement.",
      "The companion Area Calculator, built as a plugin for Rhino 5 and 6, lets users compare current area allocations against design requirements in real time, cutting a calculation that once took an employee minutes or hours down to seconds.",
    ],
    images: Array.from({ length: 5 }, (_, i) => ({
      url: `/projects/design-analysis/${i + 1}.jpeg`,
      width: 1912,
      height: 1237,
    })),
    order: 5,
  },
  {
    slug: "vr-interfaces",
    title: "Interfaces for Virtual Reality",
    subtitle: "Autodesk Office of the CTO (OCTO)",
    description:
      "Exploring interfaces for interacting within virtual reality environments, bringing Autodesk product suite functionality into VR.",
    thumbnail: {
      url: "/projects/vr-interfaces/1.jpeg",
      alt: "Autodesk VR interface prototype",
      width: 1800,
      height: 675,
    },
    skills: ["Virtual Reality"],
    role: "VR Design Intern",
    organization: "Autodesk — Office of the CTO",
    tools: ["Stingray Game Engine"],
    content: [
      "While working in the Stingray game engine, our team explored numerous interfaces for interacting with virtual reality environments.",
      "These experiments aimed to bring functionalities found across the Autodesk product suite and traditional 3D tools into the VR space, testing a range of interface elements for spatial interaction.",
    ],
    images: Array.from({ length: 13 }, (_, i) => ({
      url: `/projects/vr-interfaces/${i + 1}.jpeg`,
      width: 1800,
      height: 675,
    })),
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
      "At Keystone Strategy, I've worked on numerous high-impact strategy and digital transformation projects for clients such as Facebook, Microsoft, Oracle, and Dow Jones.",
  },
  {
    organization: "Kohn Pedersen Fox — Urban Interface",
    description:
      "At Kohn Pedersen Fox, I worked on the Urban Interface team. Our team was contracted for the urban design and interface simulations of the Waterfront Toronto project by Sidewalk Labs.",
  },
  {
    organization: "Tesla",
    description:
      "At Tesla, I worked on the Special Projects team based in Fremont, CA on numerous sprint-based projects to solve pressing operations issues.",
  },
  {
    organization: "Google",
    description:
      "At Google, I worked on a five-person team within the ATAP (Advanced Technology and Projects) group on Project Ara, specializing in UX/UI design.",
  },
  {
    organization: "Autodesk",
    description:
      "At Autodesk, I worked on a team of four interns specializing in VR. We were tasked with exploring the integration of VR into the Autodesk product line, and reported to the CTO.",
  },
  {
    organization: "Cornell University",
    description:
      "At Cornell, I worked for the Cornell Program of Computer Graphics as a researcher and teaching assistant under Don Greenberg's leadership.",
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
      "People: the most important aspect of a product or design. The key to success is their satisfaction. I strive to create solutions that solve problems and change lives.",
  },
  {
    title: "Environmental Design",
    description:
      "I graduated from Cornell University with a B.Arch and have always had a passion for architecture and the built environment. I've worked on numerous smart spaces projects, ranging from complex urban environments to interactive exhibits.",
  },
]

export const contactEmail = "john.scheeler44@gmail.com"
export const resumeUrl = "/resume/john-scheeler-resume.pdf"
