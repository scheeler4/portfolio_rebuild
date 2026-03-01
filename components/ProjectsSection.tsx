"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type AnyProject, isFullProject } from "@/lib/hygraph"

interface ProjectsSectionProps {
  projects: AnyProject[]
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const allSkills = Array.from(new Set(projects.flatMap((p) => p.skills))).sort()

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    )
  }

  const filtered = projects.filter(
    (p) => selectedSkills.length === 0 || selectedSkills.some((s) => p.skills.includes(s))
  )

  return (
    <section id="work" className="py-24 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            Selected Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
            Projects that shape how we understand data
          </h2>
        </div>

        {/* Skill filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setSelectedSkills([])}
            className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
              selectedSkills.length === 0
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            All
          </button>
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${
                selectedSkills.includes(skill)
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>

        {/* Mixed project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No projects match the selected filters.</p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/*  Unified Project Card                                               */
/* ------------------------------------------------------------------ */
function ProjectCard({ project }: { project: AnyProject }) {
  const thumbnailUrl = project.thumbnail?.url || "/placeholder.svg?height=400&width=600"
  const isFull = isFullProject(project)

  return (
    <Link
      href={`/project/${project.slug}`}
      className="group block bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <Image
          src={thumbnailUrl}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight className="h-4 w-4 text-foreground" />
        </div>
        {isFull && (
          <div className="absolute top-4 left-4">
            <span className="text-[10px] font-medium tracking-widest uppercase text-white/60 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full">
              Case Study
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors duration-200">
          {project.title}
        </h3>
        {project.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {project.skills.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-[11px] font-medium bg-secondary text-secondary-foreground"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}
