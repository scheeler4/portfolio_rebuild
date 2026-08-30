import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getProjectBySlug, type Project } from "@/lib/projects"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  return {
    title: project ? `${project.title} | John Scheeler` : "Project | John Scheeler",
    description: project?.description || "",
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

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

  return <ProjectDetail project={project} />
}

function ProjectDetail({ project }: { project: Project }) {
  const headerUrl = project.thumbnail.url

  return (
    <div className="min-h-screen bg-background">
      <ProjectNav />

      {/* Header image */}
      <div className="relative h-[50vh] min-h-[360px] w-full mt-16">
        <Image
          src={headerUrl || "/placeholder.svg"}
          alt={project.thumbnail.alt || project.title}
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
            {project.subtitle && (
              <p className="text-lg text-muted-foreground max-w-2xl">{project.subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        {/* Meta grid */}
        <div className="grid sm:grid-cols-3 gap-8 mb-16 pb-16 border-b border-border">
          {project.organization && (
            <div>
              <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                Organization
              </h3>
              <p className="text-sm text-foreground">{project.organization}</p>
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

        {/* Award callout */}
        {project.award && (
          <div className="mb-16 rounded-xl border border-primary/20 bg-primary/5 px-6 py-4">
            <p className="text-xs font-medium tracking-wider uppercase text-primary mb-1">Award</p>
            <p className="text-sm text-foreground">{project.award}</p>
          </div>
        )}

        {/* About content */}
        <div className="max-w-3xl mb-16 space-y-5">
          <h2 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
            About
          </h2>
          {project.content.map((paragraph, index) => (
            <p key={index} className="text-muted-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tools used */}
        {project.tools && project.tools.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-3">
              Tools Used
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="outline"
                  className="text-xs border-border text-foreground"
                >
                  {tool}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {project.video && (
          <div className="mb-16">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border">
              <iframe
                src={project.video.url}
                title={project.video.caption || "Project Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
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
                    alt={image.alt || `${project.title} image ${index + 1}`}
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
          &copy; {new Date().getFullYear()} John Scheeler. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
