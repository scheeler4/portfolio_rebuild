import { getAllProjects, fallbackProjects } from "@/lib/hygraph"
import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import ProjectsSection from "@/components/ProjectsSection"
import Footer from "@/components/Footer"

export default async function Portfolio() {
  const projects = (await getAllProjects()) || fallbackProjects

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <ProjectsSection projects={projects} />
      <Footer />
    </div>
  )
}
