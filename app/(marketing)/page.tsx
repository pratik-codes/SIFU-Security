import React from "react"
import Link from "next/link"

import { env } from "@/env.mjs"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import ApiClient from "@/components/api-client"
import { FeaturesBento } from "@/components/features-bento"
import { HoverBorderGradient } from "@/components/hover-border-gradient"
import ScanPreview from "@/components/scan-preview"
import { Spotlight } from "@/components/spotlight"
import { FeaturesScroll } from "@/components/features-scroll"
import { trackEvent } from "@/lib/analytics"



export default async function IndexPage() {
  return (
    <>
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          {/* <div
            // href={siteConfig.links.twitter}
            className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
          >
           launching soon!
          </div> */}
          <Spotlight
            className="-top-50 left-0 md:left-60 md:-top-20"
            fill="white"
          />
          <div className=" p-4 max-w-8xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Shield your sols with sifu’s ultimate security tools
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 max-w-xl text-center mx-auto">
              Stay safe. Stay secure. Stay ahead with Sifu.
            </p>
          </div>
          <div className="space-x-4">
            <Link
              href="/early-access"
              className={cn(buttonVariants({ size: "lg" }))}
            >
              Get Early Access
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div className="mt-8">
          <ScanPreview />
        </div>
      </section>
      <section
        id="features"
        className="container bg-slate-50 py-8 dark:bg-transparent"
      >
        {/* <FeaturesScroll content={featuresContent} /> */}
        <FeaturesBento />
      </section>
      <section id="open-source" className="container py-12 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-centear my-16">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Proudly Open Source
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            SIFU is open source and powered by open source software. <br />{" "}
            The code is available on{" "}
            <Link
              href={"https://github.com/pratik-codes/Blockchain-Audit-Platform"}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              GitHub
            </Link>
            .{" "}
          </p>
        </div>
      </section>
    </>
  )
}
