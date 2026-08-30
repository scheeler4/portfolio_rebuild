import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { coreTenets, workExperience, contactEmail } from "@/lib/projects"

export const metadata: Metadata = {
  title: "About | John Scheeler",
  description:
    "Designer at heart, with the technical knowledge to find solutions in new places.",
}

export default function AboutPage() {
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
            {"I'm a designer at heart, with the technical knowledge to find solutions in new places."}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed animate-fade-in-up animation-delay-400">
            My work sits at the intersection of architecture, computation, and user experience —
            shaped by an interdisciplinary path through strategy consulting, engineering, and
            design.
          </p>
          <p className="text-sm text-muted-foreground mt-4 animate-fade-in-up animation-delay-400">
            Based in California, USA
          </p>
        </div>
      </section>

      {/* Core tenets */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Core Tenets
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              How I approach my work
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl">
            {coreTenets.map((tenet) => (
              <div key={tenet.title} className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">{tenet.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tenet.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Work experience */}
      <section className="py-24 px-6 lg:px-8 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3">
              Experience
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-balance">
              Places I&apos;ve worked
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workExperience.map((job) => (
              <div
                key={job.organization}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <h3 className="text-base font-semibold text-foreground mb-3">
                  {job.organization}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </p>
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
            {"Interested in collaborating or learning more about my work? I'd love to hear from you."}
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/30 hover:text-primary transition-all duration-200"
            >
              <Mail className="h-4 w-4" />
              {contactEmail}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} John Scheeler. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
