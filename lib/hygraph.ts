import { GraphQLClient, gql } from "graphql-request"

// ---------------------------------------------------------------------------
// Hygraph Content API client
// ---------------------------------------------------------------------------
// To connect your portfolio to Hygraph:
// 1. Create a Hygraph project at https://hygraph.com
// 2. Add the HYGRAPH_ENDPOINT env var (Content API -> Read-only URL)
//
// Required Hygraph content models:
//
// FullProject
//   - title          (Single line text, required)
//   - slug           (Slug, from title, required, unique)
//   - description    (Multi line text)
//   - thumbnail      (Asset)
//   - headerImage    (Asset)
//   - skills         (List of strings)
//   - role           (Single line text)
//   - completionDate (Single line text)
//   - duration       (Single line text)
//   - content        (Rich Text)
//   - images         (Assets, multi)
//   - video          (JSON -- { type: "youtube"|"direct", url: string, caption: string })
//   - featured       (Boolean)
//   - order          (Integer, for sort order)
//
// LightProject
//   - title          (Single line text, required)
//   - slug           (Slug, from title, required, unique)
//   - description    (Multi line text)
//   - thumbnail      (Asset)
//   - skills         (List of strings)
//   - images         (Assets, multi -- small gallery, max ~4)
//   - order          (Integer, for sort order)
//
// AboutPage (singleton)
//   - headline       (Single line text)
//   - subheadline    (Single line text)
//   - bio            (Rich Text)
//   - skills         (JSON -- array of SkillCategory objects)
//   - socialLinks    (JSON -- { email, linkedin, github })
// ---------------------------------------------------------------------------

const ENDPOINT = process.env.HYGRAPH_ENDPOINT || ""

function getClient() {
  if (!ENDPOINT) return null
  return new GraphQLClient(ENDPOINT)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface HygraphAsset {
  url: string
  width?: number
  height?: number
}

/** Full case-study project with rich text, video, and extensive detail. */
export interface FullProject {
  __typename: "FullProject"
  title: string
  slug: string
  description: string
  thumbnail?: HygraphAsset
  headerImage?: HygraphAsset
  skills: string[]
  role?: string
  completionDate?: string
  duration?: string
  content?: { html: string }
  images: HygraphAsset[]
  video?: { type: "youtube" | "direct"; url: string; caption?: string }
  featured?: boolean
  order?: number
}

/** Light project with just metadata and a small image gallery. */
export interface LightProject {
  __typename: "LightProject"
  title: string
  slug: string
  description: string
  thumbnail?: HygraphAsset
  skills: string[]
  images: HygraphAsset[]
  order?: number
}

/** Union type used in the mixed grid. */
export type AnyProject = FullProject | LightProject

export function isFullProject(p: AnyProject): p is FullProject {
  return p.__typename === "FullProject"
}

export interface HygraphSkillCategory {
  title: string
  skills: string[]
  description: string
  projects: string[]
}

export interface HygraphAboutPage {
  headline: string
  subheadline: string
  bio: { html: string }
  skills: HygraphSkillCategory[]
  socialLinks: { email?: string; linkedin?: string; github?: string }
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------
const GET_FULL_PROJECTS = gql`
  query GetFullProjects {
    fullProjects(orderBy: order_ASC) {
      __typename
      title
      slug
      description
      thumbnail { url width height }
      skills
      featured
      order
    }
  }
`

const GET_LIGHT_PROJECTS = gql`
  query GetLightProjects {
    lightProjects(orderBy: order_ASC) {
      __typename
      title
      slug
      description
      thumbnail { url width height }
      skills
      order
    }
  }
`

const GET_FULL_PROJECT_BY_SLUG = gql`
  query GetFullProjectBySlug($slug: String!) {
    fullProject(where: { slug: $slug }) {
      __typename
      title
      slug
      description
      headerImage { url width height }
      thumbnail { url width height }
      skills
      role
      completionDate
      duration
      content { html }
      images { url width height }
      video
      featured
    }
  }
`

const GET_LIGHT_PROJECT_BY_SLUG = gql`
  query GetLightProjectBySlug($slug: String!) {
    lightProject(where: { slug: $slug }) {
      __typename
      title
      slug
      description
      thumbnail { url width height }
      skills
      images { url width height }
    }
  }
`

const GET_ALL_SLUGS = gql`
  query GetAllSlugs {
    fullProjects { slug }
    lightProjects { slug }
  }
`

const GET_ABOUT_PAGE = gql`
  query GetAboutPage {
    aboutPage(where: { id: "cldefault" }) {
      headline
      subheadline
      bio { html }
      skills
      socialLinks
    }
  }
`

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

/** Fetches both project types and returns them merged + sorted by order. */
export async function getAllProjects(): Promise<AnyProject[] | null> {
  const client = getClient()
  if (!client) return null
  try {
    const [fullData, lightData] = await Promise.all([
      client.request<{ fullProjects: FullProject[] }>(GET_FULL_PROJECTS),
      client.request<{ lightProjects: LightProject[] }>(GET_LIGHT_PROJECTS),
    ])
    const all: AnyProject[] = [...fullData.fullProjects, ...lightData.lightProjects]
    all.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    return all
  } catch (e) {
    console.error("[Hygraph] Failed to fetch projects:", e)
    return null
  }
}

/** Try full first, then light. */
export async function getProjectBySlug(slug: string): Promise<AnyProject | null> {
  const client = getClient()
  if (!client) return null
  try {
    const full = await client.request<{ fullProject: FullProject | null }>(
      GET_FULL_PROJECT_BY_SLUG,
      { slug }
    )
    if (full.fullProject) return full.fullProject

    const light = await client.request<{ lightProject: LightProject | null }>(
      GET_LIGHT_PROJECT_BY_SLUG,
      { slug }
    )
    return light.lightProject ?? null
  } catch (e) {
    console.error("[Hygraph] Failed to fetch project:", e)
    return null
  }
}

export async function getAllProjectSlugs(): Promise<{ slug: string; type: "full" | "light" }[]> {
  const client = getClient()
  if (!client) return []
  try {
    const data = await client.request<{
      fullProjects: { slug: string }[]
      lightProjects: { slug: string }[]
    }>(GET_ALL_SLUGS)
    return [
      ...data.fullProjects.map((p) => ({ slug: p.slug, type: "full" as const })),
      ...data.lightProjects.map((p) => ({ slug: p.slug, type: "light" as const })),
    ]
  } catch (e) {
    console.error("[Hygraph] Failed to fetch slugs:", e)
    return []
  }
}

export async function getAboutPage(): Promise<HygraphAboutPage | null> {
  const client = getClient()
  if (!client) return null
  try {
    const data = await client.request<{ aboutPage: HygraphAboutPage | null }>(GET_ABOUT_PAGE)
    return data.aboutPage
  } catch (e) {
    console.error("[Hygraph] Failed to fetch about page:", e)
    return null
  }
}

// ---------------------------------------------------------------------------
// Fallback data (used when Hygraph is not configured)
// ---------------------------------------------------------------------------
export const fallbackProjects: AnyProject[] = [
  {
    __typename: "FullProject",
    title: "Earth Data Dashboard",
    slug: "earth-data-dashboard",
    description:
      "A comprehensive platform for visualizing and analyzing environmental data in real-time.",
    skills: ["Product", "UX", "Eng"],
    featured: true,
    images: [],
    order: 1,
  },
  {
    __typename: "FullProject",
    title: "Parametric Urban Planning Tool",
    slug: "parametric-urban-planning-tool",
    description:
      "Computational design tool enabling city planners to explore generative urban layouts.",
    skills: ["Product", "Eng"],
    featured: true,
    images: [],
    order: 2,
  },
  {
    __typename: "LightProject",
    title: "Climate Impact Visualizer",
    slug: "climate-impact-visualizer",
    description:
      "Interactive visualization platform for communicating climate change scenarios.",
    skills: ["UX", "Eng"],
    images: [],
    order: 3,
  },
  {
    __typename: "FullProject",
    title: "Smart City Dashboard",
    slug: "smart-city-dashboard",
    description:
      "Centralized operations dashboard for monitoring smart city infrastructure.",
    skills: ["Product", "UX"],
    featured: true,
    images: [],
    order: 4,
  },
  {
    __typename: "LightProject",
    title: "Eco-Building Simulator",
    slug: "eco-building-simulator",
    description:
      "Simulation engine for modeling sustainable building performance and energy use.",
    skills: ["Product", "Eng"],
    images: [],
    order: 5,
  },
  {
    __typename: "LightProject",
    title: "Geospatial Data Explorer",
    slug: "geospatial-data-explorer",
    description:
      "A powerful tool for exploring, filtering, and understanding geospatial datasets.",
    skills: ["UX", "Eng"],
    images: [],
    order: 6,
  },
]
