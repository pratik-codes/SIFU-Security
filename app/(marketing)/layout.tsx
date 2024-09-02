import { FloatingNav } from "@/components/floating-navbar"
import { Icons } from "@/components/icons";
import { SiteFooter } from "@/components/site-footer"
import { Home, LucideProps } from "lucide-react"; // Import the LucideProps type

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <FloatingNav
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
