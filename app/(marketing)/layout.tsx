import { Home, LucideProps } from "lucide-react"

import { FloatingNav } from "@/components/floating-navbar"
import { Icons } from "@/components/icons"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"

// Import the LucideProps type

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <FloatingNav
          // classes=""
          navItems={[
            {
              name: "Features",
              link: "/#features",
              icon: <Icons.home />,
            },
            {
              name: "Api Explorer",
              link: "/api-explorer",
              icon: <Icons.api />,
            },
          ]}
        />
     <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
