"use client";

import { useEffect, useState } from "react";
import Link from "next/link";



import { trackEvent } from "@/lib/analytics";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Spotlight } from "@/components/spotlight";





export default function EarlyAccessPage() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    trackEvent("early-access-page-viewed", {})
  }, [])

  const signupHandler = (e) => {
    e.preventDefault()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+(\.[^\s@]+)*$/
    if (emailRegex.test(email)) {
      trackEvent("early-access-signup", { email })
      toast({
        title: "Success",
        description:
          "You have successfully signed up for early access. We will send you a mail soon for the oboarding.",
        duration: 4000,
      })
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
        duration: 4000,
      })
    }
  }

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
              Get access to sifu api
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
              Be among the first to experience the future of blockchain transaction security. Sign
              up now for exclusive api access and special perks.
            </p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-lg flex-1"
                placeholder="Enter your email"
                type="email"
              />
              <Button onClick={signupHandler}>Sign Up</Button>
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


