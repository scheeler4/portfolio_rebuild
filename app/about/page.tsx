import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail, Linkedin, Github } from "lucide-react"
import { getAboutPage } from "@/lib/hygraph"

export const metadata: Metadata = {
  title: "About | Portfolio",
  description:
    "Product Designer working at the intersection of architecture, computation, and earth data.",
}

// Fallback data when Hygraph is not configured
const fallbackSkills = [
  {
    title: "Design Systems",
    skills: ["UX/UI Design", "Design Systems", "Prototyping"],
    description: "Creating cohesive and scalable design systems for complex platforms.",
    projects: ["Earth Data Dashboard", "Smart City Dashboard"],
  },
  {
    title: "Data Visualization",
    skills: ["Data Analysis", "GIS", "Interactive Visualization"],
    description: "Transforming complex data sets into clear, actionable insights.",
    projects: ["Climate Impact Visualizer", "Geospatial Data Explorer"],
  },
  {
    title: "Computational Design",
    skills: ["Parametric Modeling", "3D Visualization", "Algorithm Design"],
    description: "Leveraging computational methods to solve design challenges.",
    projects: ["Parametric Urban Planning Tool", "Eco-Building Simulator"],
  },
  {
    title: "Frontend Development",
    skills: ["React", "Three.js", "WebGL"],
    description: "Building performant and interactive web applications.",
    projects: ["Earth Data Dashboard", "Climate Impact Visualizer"],
  },
  {
    title: "Environmental Analysis",
    skills: ["Earth Data Analysis", "Climate Modeling", "Environmental Impact"],
    description: "Analyzing and visualizing environmental data and impacts.",
    projects: ["Climate Impact Visualizer", "Eco-Building Simulator"],
  },
  {
    title: "Project Management",
    skills: ["Agile", "User Research", "Stakeholder Management"],
    description: "Leading cross-functional teams and managing complex projects.",
    projects: ["Smart City Dashboard", "Geospatial Data Explorer"],
  },
]

export default async function AboutPage() {
  const aboutData = await getAboutPage()

  const skills = aboutData?.skills || fallbackSkills
  const socialLinks = aboutData?.socialLinks || {
    email: "your.email@example.com",
    linkedin: "https://linkedin.com/in/yourprofile",
    github: "https://github.com/yourusername",
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4 animate-fade-in-up">
            About
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in-up animation-delay-200 text-balance max-w-3xl">
            {aboutData?.headline ||
              "Working at the intersection of product strategy, engineering & user experience"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up animation-delay-400">
            {aboutData?.subheadline ||
              "Creating meaningful digital solutions that bridge business objectives and user needs through an interdisciplinary lens."}
          </p>
        </div>
      </section>

      {/* Venn diagram */}
      <section className="pb-20 px-6 lg:px-8 hidden md:block">
        <div className="max-w-6xl mx-auto">
          <div className="relative w-full max-w-2xl mx-auto h-[320px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-[600px] h-[320px]">
                {/* Product Strategy */}
                <div className="absolute left-[12%] top-[16%] w-52 h-52 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center group hover:bg-primary/10 transition-colors duration-300">
                  <div className="text-center px-4">
                    <h3 className="font-semibold text-foreground text-sm">Product Strategy</h3>
                    <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Strategy Consulting Background
                    </p>
                  </div>
                </div>
                {/* Engineering */}
                <div className="absolute right-[12%] top-[16%] w-52 h-52 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center group hover:bg-primary/10 transition-colors duration-300">
                  <div className="text-center px-4">
                    <h3 className="font-semibold text-foreground text-sm">Engineering</h3>
                    <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Computer Science Foundation
                    </p>
                  </div>
                </div>
                {/* User Experience */}
                <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2 w-52 h-52 rounded-full border border-primary/30 bg-primary/5 flex items-center justify-center group hover:bg-primary/10 transition-colors duration-300">
                  <div className="text-center px-4">
                    <h3 className="font-semibold text-foreground text-sm">User Experience</h3>
                    <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Architecture & UX Design
                    </p>
                  </div>
                </div>
                {/* Center intersection */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/15" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {aboutData?.bio ? (
            <div
              className="prose prose-invert max-w-3xl mx-auto prose-p:text-muted-foreground prose-headings:text-foreground prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: aboutData.bio.html }}
            />
          ) : (
            <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Strategic Foundation</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  My journey began in strategy consulting, where I learned to tackle complex problems
                  and translate business needs into actionable solutions. This foundation in strategic
                  thinking helps me bridge the gap between business objectives and user needs.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Technical Expertise</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  With a background in computer science, I bring a deep understanding of technical
                  possibilities and constraints. This allows me to work effectively with engineering
                  teams and architect solutions that are both innovative and feasible.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Design Thinking</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  My architectural background taught me to think spatially and understand how people
                  interact with their environment. Combined with UX design expertise, this helps me
                  create intuitive digital experiences.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">Holistic Approach</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Today, I combine these diverse perspectives to create digital products that are
                  strategically sound, technically robust, and delightful to use. This
                  interdisciplinary approach delivers real value.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Expertise
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Areas of focus
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((category) => (
              <div
                key={category.title}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="text-base font-semibold text-foreground mb-4">{category.title}</h3>
                <div className="space-y-2 mb-4">
                  {category.skills.map((skill: string) => (
                    <div key={skill} className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">{skill}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {category.description}
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Related Projects
                  </p>
                  <div className="space-y-1">
                    {category.projects.map((project: string) => (
                      <p key={project} className="text-sm text-primary">
                        {project}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
            Contact
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 text-balance">
            {"Let's work together"}
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
            Interested in collaborating or learning more about my work? I'd love to hear from you.
          </p>
          <div className="flex justify-center gap-6">
            {socialLinks.email && (
              <Link
                href={`mailto:${socialLinks.email}`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                <Mail className="h-4 w-4" />
                Email
              </Link>
            )}
            {socialLinks.linkedin && (
              <Link
                href={socialLinks.linkedin}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Link>
            )}
            {socialLinks.github && (
              <Link
                href={socialLinks.github}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary transition-all duration-200"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} YourName. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
