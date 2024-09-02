import React from "react";



import { Featurecard } from "./feature-card";
import { TextGenerateEffect } from "./generate-effect";
import { InView } from "./in-view";


const items = [
  {
    title: "Real-Time Auditing",
    description:
      "Monitor smart contracts, transactions, and wallet addresses in real-time with advanced analytics and reporting tools. Sifu ensures that you stay ahead of potential threats by providing continuous, automated oversight of your blockchain operations. With real-time data streams and machine learning-driven anomaly detection, you can immediately respond to any suspicious activity, maintaining the security and integrity of your digital assets.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1674506654010-22677db35bdf?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    position: "left",
  },
  {
    title: "Smart Contract Analysis",
    description:
      "Perform deep analysis of smart contracts to uncover vulnerabilities, inefficiencies, and potential exploits. Sifu leverages advanced algorithms and machine learning to scrutinize every line of code, ensuring your contracts are robust and secure against malicious attacks. Our platform provides detailed reports and suggestions for improvement, giving you peace of mind before deployment and ensuring long-term contract reliability.",
    imageUrl:
      "https://images.unsplash.com/photo-1615525137689-198778541af6?q=80&w=3264&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    position: "right",
  },
  {
    title: "Seamless API Integration",
    description:
      "Effortlessly integrate Sifu’s comprehensive auditing and monitoring tools into your existing systems. Our API is designed for developers, offering quick setup and robust security features that align with your current infrastructure. With minimal downtime and continuous protection, Sifu’s API ensures that your systems remain resilient and secure without compromising performance or flexibility.",
    imageUrl:
      "https://media.istockphoto.com/id/1314565355/photo/api-application-programming-interface-software-development-tool-business-modern-technology.webp?s=2048x2048&w=is&k=20&c=x4tNbg-BZxn5YZ3yF4BHF8KUfH4bgI3Uosal7kaRl6Y=",
    position: "left",
  },
  {
    title: "Blockchain Forensics",
    description:
      "Conduct in-depth forensic investigations on blockchain transactions and addresses. Sifu provides the tools to trace and analyze complex transaction flows, uncover hidden patterns, and identify potential fraud or malicious activities. Our platform offers a detailed audit trail, empowering you to respond decisively to any findings, whether for compliance, legal, or security purposes.",
    imageUrl:
      "https://images.unsplash.com/photo-1642751227520-32ec1a7a4b11?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    position: "right",
  },
  {
    title: "Instant Alerts",
    description:
      "Stay informed with real-time notifications of threats or suspicious activities. Sifu’s alert system ensures that you receive immediate updates, allowing for rapid response and mitigation. Whether it’s a contract vulnerability or an unusual transaction, you’ll be equipped to act swiftly and maintain the integrity of your operations. Customize alert settings to fit your specific needs, ensuring you only receive the most relevant and critical information.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1679086008175-cfde7c4a4ea8?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    position: "left",
  },
  {
    title: "Enhanced Data Privacy",
    description:
      "Protect sensitive information with Sifu’s advanced encryption and privacy features. Our platform is designed to keep your data secure during the auditing process, ensuring that confidential information remains private and protected from unauthorized access. Sifu delivers insightful analysis and reports without compromising the security of your data, making it an ideal choice for businesses prioritizing confidentiality.",
    imageUrl:
      "https://media.istockphoto.com/id/1182226451/photo/encryption-your-data-digital-lock-hacker-attack-and-data-breach-big-data-with-encrypted.jpg?s=2048x2048&w=is&k=20&c=CcblC8uL-xwQ-amVy37lA22l7EGz7BqDgDozMh5T4vU=",
    position: "right",
  },
]

const words = `Empowering Blockchain Security with Cutting-Edge Features: Analyze, Monitor, and Protect Your Digital Assets.`

export function Features() {
  return (
    <div>
      <InView>
        <TextGenerateEffect duration={2} filter={false} words={words} className="mb-16 text-center"/>
      </InView>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
        {items.map((item, i) => (
          <Featurecard key={i} {...item} />
        ))}
      </div>
    </div>
  )
}
