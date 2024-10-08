import { Home, LucideProps } from "lucide-react"

import { FloatingNav } from "@/components/floating-navbar"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

// Import the LucideProps type

interface DemoLayoutProps {
  children: React.ReactNode
}

export default async function DemoLayout({
  children,
}: DemoLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
     <main className="flex-1">{children}</main>
    </div>
  )
}
