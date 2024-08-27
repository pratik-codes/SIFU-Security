import React from "react";



import { cn } from "@/lib/utils";



import { BentoGrid, BentoGridItem } from "./bento";


export function FeaturesBento() {
  return (
    <BentoGrid className="mx-auto">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon={item.icon}
          className={i === 3 || i === 6 ? "md:col-span-2" : ""}
        />
      ))}
    </BentoGrid>
  )
}
const Skeleton = () => (
  <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100"></div>
)
const items = [
  {
    title: "Real-Time Auditing",
    description:
      "Monitor smart contracts, transactions, and wallet addresses in real-time. keep your blockchain operations secure.",
    header: <Skeleton />,
    icon: "https://plus.unsplash.com/premium_photo-1671461774955-7aab3ab41b90?q=80&w=2792&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Smart Contract Analysis",
    description:
      "Analyze smart contracts thoroughly to detect vulnerabilities before they can be exploited. BlockSec ensures your code is airtight, minimizing risk.",
    header: <Skeleton />,
    icon: "https://images.unsplash.com/photo-1615525137689-198778541af6?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Instant Alerts",
    description:
      "Receive immediate notifications of any detected threats or unusual activities. With BlockSec, you're always informed and ready to respond.",
    header: <Skeleton />,
    icon: "https://plus.unsplash.com/premium_photo-1679086008175-cfde7c4a4ea8?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Seamless API Integration",
    description:
      "Integrate BlockSec’s powerful auditing tools into your existing systems with ease. Our API is designed for quick deployment, ensuring robust security without disrupting your workflow.",
    header: <Skeleton />,
    icon: "https://media.istockphoto.com/id/1314565355/photo/api-application-programming-interface-software-development-tool-business-modern-technology.webp?s=2048x2048&w=is&k=20&c=x4tNbg-BZxn5YZ3yF4BHF8KUfH4bgI3Uosal7kaRl6Y=",
  },
  {
    title: "Enhanced Data Privacy",
    description:
      "Ensure that sensitive data remains secure and confidential throughout the auditing process. BlockSec is designed with privacy in mind, safeguarding your data while delivering powerful insights.",
    header: <Skeleton />,
    icon: "https://media.istockphoto.com/id/1182226451/photo/encryption-your-data-digital-lock-hacker-attack-and-data-breach-big-data-with-encrypted.jpg?s=2048x2048&w=is&k=20&c=CcblC8uL-xwQ-amVy37lA22l7EGz7BqDgDozMh5T4vU=",
  },
  // {
  //   title: "The Joy of Creation",
  //   description: "Experience the thrill of bringing ideas to life.",
  //   header: <Skeleton />,
  //   // icon: <IconBoxAlignTopLeft className="h-4 w-4 text-neutral-500" />,
  // },
  // {
  //   title: "The Spirit of Adventure",
  //   description: "Embark on exciting journeys and thrilling discoveries.",
  //   header: <Skeleton />,
  //   // icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  // },
]
