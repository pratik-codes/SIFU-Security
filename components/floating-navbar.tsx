"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  AnimatePresence,
  motion,
  useScroll,
} from "framer-motion"
import { Home } from "lucide-react"

import { cn } from "@/lib/utils"

import { Icons } from "./icons"

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
  }) => {
  if (typeof window !== "undefined" && window.location.pathname.includes("/demo")) {
    return <></>
  }


  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <div className="hidden md:block">
          <div
            className={cn(
              "flex w-6/12 mt-4 fixed top-0 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] z-[5000] pr-2 pl-8 py-2  items-center justify-between space-x-4",
              className
            )}
          >
            <Link href={"/#home"}  className="flex justify-start items-center space-x-2 mr-12">
              <Icons.logo />
              <span className="text-lg font-bold">SIFU</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-4">
            {navItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 hover:underline flex"
                )}
              >
                {/* <span className="h-2 w-2 mr-2">{navItem.icon}</span> */}
                <span className="text-sm font-bold">{navItem.name}</span>
              </Link>
            ))}
              </div>
            <Link
              href="early-access"
              className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
            >
              <span>Api Access</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-gray-100 to-transparent  h-px" />
              </Link>
            </div>
          </div>
        </div>
        <div className="md:hidden block flex w-full justify-between items-center">
          <div
            className={cn(
              "flex max-w-fit space-x-4 mt-4 fixed top-0 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2  items-center justify-center space-x-4",
              className
            )}
          >
            <Link href={"/#home"} className="flex justify-start items-center space-x-2">
              <Icons.logo />
              <span className="text-lg font-bold">SIFU</span>
            </Link>
            <Link
              href="api-explorer"
              className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
            >
              <span>Explore Api's</span>
              <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-gray-100 to-transparent  h-px" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
