import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spotlight } from "@/components/spotlight"

export const metadata = {
  title: "Early Access",
}

export default function EarlyAccessPage() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <Spotlight
        className="-top-50 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Get Early Access to Blocksec Api
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Be among the first to experience the future of productivity. Sign
              up now for exclusive early access and special perks.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
              />
              <Button type="submit">Sign Up</Button>
            </form>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing up, you agree to our{" "}
              <Link className="underline underline-offset-2" href="#">
                Terms & Conditions
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
