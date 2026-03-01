"use client"

import { Suspense } from "react"
import { ChevronDown } from "lucide-react"
import dynamic from "next/dynamic"

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), { ssr: false })

export default function HeroSection() {
  const scrollToWork = () => {
    const el = document.querySelector("#work")
    if (el) {
      window.scrollTo({ top: (el as HTMLElement).offsetTop - 72, behavior: "smooth" })
    }
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-background flex items-center justify-center">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <ThreeBackground />
      </Suspense>

      <div className="text-center z-10 relative max-w-4xl mx-auto px-4 sm:px-6 pb-24 sm:pb-16 md:pb-0 mt-[-14vh] sm:mt-[-8vh] md:mt-[-6vh]">
        <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-primary mb-3 sm:mb-6 animate-fade-in-up">
          Portfolio
        </p>
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 sm:mb-6 animate-fade-in-up animation-delay-200 text-foreground leading-tight text-balance">
          Bridging Architecture, Computation & Earth Data
        </h1>
        <p className="text-xs sm:text-base md:text-lg lg:text-xl animate-fade-in-up animation-delay-400 text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
          Product Designer specializing in earth data platforms, interactive visualization, and computational design.
        </p>
      </div>

      <button
        onClick={scrollToWork}
        className="absolute bottom-20 sm:bottom-16 md:bottom-10 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-foreground transition-colors duration-300 animate-scroll-hint hidden sm:block"
        aria-label="Scroll to work"
      >
        <ChevronDown className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </section>
  )
}
