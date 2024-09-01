import { Home, PhoneCall, Settings, User, Link } from "lucide-react"
import AnimatedBackground from "./animated-background"


export function AnimatedDock() {
  const TABS = [
    {
      label: "Home",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Api Explorer",
      icon: <Link className="h-5 w-5" />,
    },
    {
      label: "Services",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: "Contact",
      icon: <PhoneCall className="h-5 w-5" />,
    },
  ]

  return (
    <div className="bottom-8">
      <div className="flex w-full space-x-2 rounded-full border-zinc-950/10 bg-black p-2 ">
        <AnimatedBackground
          defaultValue={TABS[0].label}
          className="rounded-lg bg-zinc-100"
          transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.3,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.label}
              data-id={tab.label}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950"
            >
              {tab.icon}
            </button>
          ))}
        </AnimatedBackground>
      </div>
    </div>
  )
}
