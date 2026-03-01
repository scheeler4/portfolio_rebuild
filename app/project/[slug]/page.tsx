import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getProjectBySlug,
  getAllProjectSlugs,
  fallbackProjects,
  isFullProject,
  type AnyProject,
  type FullProject,
  type LightProject,
} from "@/lib/hygraph"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ---------------------------------------------------------------------------
// SSG
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs()
  if (slugs.length > 0) return slugs.map((s) => ({ slug: s.slug }))
  return fallbackProjects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await resolveProject(slug)
  return {
    title: project ? `${project.title} | Portfolio` : "Project | Portfolio",
    description: project?.description || "",
  }
}

// ---------------------------------------------------------------------------
// Data resolution -- CMS first, then fallback
// ---------------------------------------------------------------------------
const fullFallbackDetails: Record<string, Partial<FullProject>> = {
  "earth-data-dashboard": {
    role: "Lead Designer & Developer",
    completionDate: "2024",
    duration: "6 months",
    content: {
      html: "<p>A comprehensive platform for visualizing and analyzing environmental data. This project involved building real-time data pipelines, interactive map layers, and intuitive filtering interfaces that enable researchers to explore climate datasets at scale.</p>",
    },
  },
  "parametric-urban-planning-tool": {
    role: "Product Designer",
    completionDate: "2023",
    duration: "8 months",
    content: {
      html: "<p>A computational design tool enabling city planners to explore generative urban layouts. The tool uses parametric algorithms to produce optimized building footprints, road networks, and green spaces based on user-defined constraints.</p>",
    },
  },
  "smart-city-dashboard": {
    role: "Lead Engineer",
    completionDate: "2024",
    duration: "4 months",
    content: {
      html: "<p>Centralized operations dashboard for monitoring smart city infrastructure. Integrates IoT sensor networks, traffic systems, and energy grids into a single real-time view for city administrators.</p>",
    },
  },
}

async function resolveProject(slug: string): Promise<AnyProject | null> {
  const cms = await getProjectBySlug(slug)
  if (cms) return cms

  const fb = fallbackProjects.find((p) => p.slug === slug)
  if (!fb) return null

  if (isFullProject(fb)) {
    return {
      ...fb,
      ...fullFallbackDetails[slug],
      headerImage: { url: "/placeholder.svg?height=600&width=1200" },
      images: [
        { url: "/placeholder.svg?height=800&width=1200" },
        { url: "/placeholder.svg?height=800&width=1200" },
      ],
    }
  }

  return {
    ...fb,
    images: [
      { url: "/placeholder.svg?height=800&width=1200" },
      { url: "/placeholder.svg?height=800&width=600" },
    ],
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await resolveProject(slug)

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Project not found</h1>
          <Link href="/" className="text-primary hover:underline text-sm">
            Back to portfolio
          </Link>
        </div>
      </div>
    )
  }

  return isFullProject(project) ? (
    <FullProjectPage project={project} />
  ) : (
    <LightProjectPage project={project} />
  )
}

// ---------------------------------------------------------------------------
// Full Project Page -- rich detail with header image, content, video
// ---------------------------------------------------------------------------
function FullProjectPage({ project }: { project: FullProject }) {
  const headerUrl = project.headerImage?.url || "/placeholder.svg?height=600&width=1200"

  return (
    <div className="min-h-screen bg-background">
      <ProjectNav />

      {/* Header image */}
      <div className="relative h-[50vh] min-h-[360px] w-full mt-16">
        <Image
          src={headerUrl}
          alt={project.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <span className="text-[10px] font-medium tracking-widest uppercase text-primary mb-3 block">
              Case Study
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3 text-balance">
              {project.title}
            </h1>
            {project.description && (
              <p className="text-lg text-muted-foreground max-w-2xl">{project.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        {/* Meta grid */}
        <div className="grid sm:grid-cols-3 gap-8 mb-16 pb-16 border-b border-border">
          {(project.completionDate || project.duration) && (
            <div>
              <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                Timeline
              </h3>
              {project.completionDate && (
                <p className="text-sm text-foreground">Completed {project.completionDate}</p>
              )}
              {project.duration && (
                <p className="text-sm text-muted-foreground">{project.duration}</p>
              )}
            </div>
          )}
          {project.role && (
            <div>
              <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                Role
              </h3>
              <p className="text-sm text-foreground">{project.role}</p>
            </div>
          )}
          {project.skills.length > 0 && (
            <div>
              <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="text-xs bg-secondary text-secondary-foreground"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rich text content */}
        {project.content?.html && (
          <div
            className="prose prose-invert max-w-3xl prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground mb-16"
            dangerouslySetInnerHTML={{ __html: project.content.html }}
          />
        )}

        {/* Video */}
        {project.video && (
          <div className="mb-16">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
              {project.video.type === "youtube" ? (
                <iframe
                  src={project.video.url}
                  title="Project Video"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={project.video.url}
                  controls
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </div>
            {project.video.caption && (
              <p className="mt-3 text-center text-sm text-muted-foreground">
                {project.video.caption}
              </p>
            )}
          </div>
        )}

        {/* Image gallery */}
        {project.images.length > 0 && (
          <div className="space-y-10">
            {project.images.map((image, index) => (
              <div key={index}>
                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl border border-border">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`${project.title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectFooter />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Light Project Page -- stripped-down with images + metadata only
// ---------------------------------------------------------------------------
function LightProjectPage({ project }: { project: LightProject }) {
  return (
    <div className="min-h-screen bg-background">
      <ProjectNav />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 pt-28 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {project.description}
            </p>
          )}
          {project.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {project.skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs bg-secondary text-secondary-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Image gallery -- simple grid */}
        {project.images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.images.map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-xl border border-border ${
                  index === 0 && project.images.length > 1 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${project.title} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectFooter />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------
function ProjectNav() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      </div>
    </div>
  )
}

function ProjectFooter() {
  return (
    <footer className="border-t border-border py-8 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Portfolio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
