import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";



import { Features } from "@/components/features";
import FUIFeatureSectionWithCards from "@/components/features-card";
import { TextGenerateEffect } from "@/components/generate-effect";
import { MovingBorderButton } from "@/components/moving-border-button";
import ScanPreview from "@/components/scan-preview"
import WhiteGlow from "@/components/white-glow";

import Hero from "./hero";
import TransactionTable from "@/components/transaction-table";


export default async function IndexPage() {
  return (
    <>
      <section
        id="home"
        className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32"
      >
        <Hero />

        {/* PLAYGROUND SECTION */}
        {/* TRANSACTION TABLE */}
        <div className="border-neutral-200">
          <div className="flex flex-col">
            <div></div>
            <div>
              <TransactionTable />
            </div>
          </div>
          <br />
          <br />
          <br />
        </div>
      </section>

      <section className="mb-[8rem] md:w-8/12 mx-auto relative">
        <h3 className="text-gray-200 mt-4 text-3xl font-normal font-geist tracking-tighter md:text-5xl sm:text-4xl text-center mb-8">
          Try our best in class tools
        </h3>
        <hr className="bg-white/30 h-px w-4/12 mx-auto mb-8 mt-5" />
        <WhiteGlow />
        <div className="md:flex">
          <div className="md:w-6/12">
            <ScanPreview activeTabDefault="address" />
          </div>
          <div className="md:w-6/12">
            <ScanPreview activeTabDefault="transaction" />
          </div>
        </div>
        <div>
          <ScanPreview activeTabDefault="contract" />
        </div>
      </section>

      {/* feature section */}
      <section
        id="features"
        className="md:w-9/12  mx-auto bg-slate-50 py-8 dark:bg-transparent"
      >
        <FUIFeatureSectionWithCards />
        {/* <Features /> */}
      </section>
    </>
  )
}
