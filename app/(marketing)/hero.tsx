"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { MovingBorderButton } from "@/components/moving-border-button"
import { Spotlight } from "@/components/spotlight"

const Hero = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.7 }}
      className="container flex max-w-[64rem] flex-col items-center gap-4 text-center"
    >
      <div className="rounded-3xl mt-24 lg:mt-0 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] px-4 text-sm font-medium">
        <Image
          className="py-2 px-2"
          src="https://solana.com/_next/static/media/logotype.e4df684f.svg"
          alt="Solana Logo"
          width={150}
          height={150}
        />
      </div>
      <Spotlight
        className="-top-50 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className="md:mt-2 mt-0 p-4 max-w-8xl mx-auto relative z-10 w-full md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          Safeguarding every Solana user
        </h1>

        <p className="mt-2 font-normal text-base text-neutral-300 max-w-xl text-center mx-auto">
          from fraudulent and malicious transactions or smart contracts.
        </p>
      </div>

      <div className="space-x-4">
        <MovingBorderButton>
          <Link href="/early-access" className="font-bold flex items-center">
            Get Api Access
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </MovingBorderButton>
      </div>
    </motion.div>
  )
}

export default Hero
