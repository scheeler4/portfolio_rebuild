import { getAllProjects } from "@/lib/projects"
import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import ProjectsSection from "@/components/ProjectsSection"
import Footer from "@/components/Footer"

export default function Portfolio() {
  const projects = getAllProjects()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProjectsSection projects={projects} />
      <Footer />
    </div>
  )
}
