import { Activity, Shield } from "lucide-react"

export default function ChainAnalyzerDesc() {
  return (
    <div className="-p-8 rounded-lg mb-12">
      <h3 className="text-gray-200 lg:w-9/12 mx-auto mb-12 text-center text-3xl font-bold font-geist tracking-tighter md:text-5xl sm:text-4xl">
        Everything you need to <span className="text-gray-600">protect</span>{" "}
        crypto transactions in real-time
        {/* <hr className="bg-white/30 h-px w-8/12 mx-auto mt-6"/> */}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center text-center p-6 rounded-lg">
          <div className="text-white rounded-full mb-4 p-5 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Off-Chain Monitoring</h3>
          <p className="font-bold text-gray-600">
            "Real-Time Off-Chain Transaction Monitoring & Alerts"
          </p>
          <p className="mt-4 text-sm">
            Off-chain, our system continuously monitors the transaction
            ecosystem for unusual patterns or signs of fraud. Users of your DApp
            will receive instant alerts when suspicious activity is detected,
            allowing them to take action before a threat becomes reality. This
            provides an additional layer of security, even outside of the
            blockchain.
          </p>
        </div>
        <div className="flex flex-col items-center text-center p-6 rounded-lg">
                    <div className="text-white rounded-full mb-4 p-5 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold mb-2">On-Chain Transactions</h3>
          <p className="text-gray-600 font-bold">
            "Proactive Defense Against On-Chain Exploits"
          </p>
          <p className="mt-4 text-sm">
            We automatically halt any transaction deemed malicious based on
            real-time analysis. Whether it's a vulnerability exploit, rug pull,
            or suspicious activity, our on-chain security tools block harmful
            transactions before they complete, ensuring your contract's
            integrity at all times.
          </p>
        </div>
      </div>
    </div>
  )
}
