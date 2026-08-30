import Link from "next/link"
import { Mail } from "lucide-react"
import { contactEmail } from "@/lib/projects"

export default function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} John Scheeler. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href={`mailto:${contactEmail}`}
            className="text-muted-foreground hover:text-foreground transition-colors duration-200"
            aria-label="Email"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
