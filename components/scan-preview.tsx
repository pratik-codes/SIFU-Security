"use client"

import React, { useEffect, useState } from "react"
import {
  AlertCircle,
  ArrowLeftRight,
  CheckCircle,
  CheckCircle2,
  Code2,
  FileSearch,
  Scan,
  ShieldCheck,
  XCircle,
} from "lucide-react"

import { DetectionApiData } from "@/config/detection-apis"
import { trackEvent } from "@/lib/analytics"
import { DetectionApiCall } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { toast } from "./ui/use-toast"
import { Textarea } from "./ui/textarea"
import WhiteGlow from "./white-glow"

const WarningMessage = {
  RED: "ALERT",
  YELLOW: "WARNING",
  GREEN: "LOOKS GOOD",
}

interface ScanPreviewProps {
  activeTabDefault: string
}

export default function ScanPreview({ activeTabDefault }: ScanPreviewProps) {
  const [activeTab, setActiveTab] = useState(activeTabDefault)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [smartContract, setSmartContract] = useState(
    DetectionApiData.SmartContract.body.contract_code
  )
  const [contractAddress, setContractAddress] = useState(
    DetectionApiData.ContractAddress.body.contract_address
  )
  const [transactionSignature, setTransactionSignature] = useState(
    DetectionApiData.Transaction.body.tx_signature
  )

  const handleScanApiCall = (res: { ok: boolean; data: any }) => {
    if (res.ok) {
      const data = res.data
      setScanResult({ ...data })
      toast({
        title: "Success",
        description: "Data scanned successfully.",
        variant: "default",
      })
      return
    } else {
      toast({
        title: "Error",
        description: "There was an error scanning the data.",
        variant: "destructive",
      })
    }
  }

  const notifyNoData = () => {
    toast({
      title: "Please enter data for the scan.",
      variant: "destructive",
    })

    setIsScanning(false)
  }

  const handleScan = async (type: string) => {
    trackEvent("Scan", { type })
    setIsScanning(true)

    let res: any = {}
    let data: any = {}

    switch (type) {
      case "SmartContract":
        if (!smartContract) {
          notifyNoData()
          return
        }
        data = DetectionApiData.SmartContract
        data.body.contract_code = smartContract
        res = await DetectionApiCall(data)
        handleScanApiCall(res)
        break
      case "ContractAdress":
        if (!contractAddress) {
          notifyNoData()
          return
        }
        data = DetectionApiData.ContractAddress
        data.body.contract_address = contractAddress
        res = await DetectionApiCall(data)
        handleScanApiCall(res)
        break
      case "Transaction":
        if (!transactionSignature) {
          notifyNoData()
          return
        }
        data = DetectionApiData.Transaction
        data.body.tx_signature = transactionSignature
        res = await DetectionApiCall(data)
        handleScanApiCall(res)
        break
    }

    if (res?.data) setScanResult(res.data)
    setIsModalOpen(true)
    setIsScanning(false)
  }

  const simulateScan = (type: string) => {
    handleScan(type)
  }

  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>,
    type: string
  ) => {
    switch (type) {
      case "SmartContract":
        setSmartContract(e.target.value.replace(/\s/g, ""))
        break
      case "ContractAddress":
        setContractAddress(e.target.value.replace(/\s/g, ""))
        break
      case "Transaction":
        setTransactionSignature(e.target.value.replace(/\s/g, ""))
        break
    }
  }

  const renderScanResult = () => {
    if (!scanResult) return null

    switch (activeTab) {
      case "contract":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-semibold">Security Score</p>
                <Progress
                  value={scanResult.security_score}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Code Quality Score</p>
                <Progress
                  value={scanResult.code_quality_score}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Gas Efficiency Score</p>
                <Progress
                  value={scanResult.gas_efficiency_score}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Correctness Score</p>
                <Progress
                  value={scanResult.correctness_score}
                  className="w-full"
                />
              </div>
            </div>
            {scanResult?.Issues && (
              <div>
                <h3 className="font-bold text-lg">Issues</h3>
                <ul className="list-disc">
                  {Object.entries(scanResult?.Issues).map(([key, value]) => (
                    <>
                      <span className="font-semibold">{key}:</span> {value}
                      <br></br>
                    </>
                  ))}
                </ul>
              </div>
            )}
            <Separator className="my-4" />
            {scanResult?.fixes && (
              <div>
                <h3 className="font-bold text-lg">Fixes</h3>
                <ul className="list-disc space-y-4">
                  {Object.entries(scanResult.fixes).map(([key, value]) => (
                    <>
                      <span className="font-semibold">{key}:</span> {value}
                      <br></br>
                    </>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      case "transaction":
      case "address":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {scanResult.color === "RED" && (
                <XCircle className="text-red-500" />
              )}
              {scanResult.color === "YELLOW" && (
                <AlertCircle className="text-yellow-500" />
              )}
              {scanResult.color === "GREEN" && (
                <CheckCircle className="text-green-500" />
              )}
              <span className="font-semibold">
                {WarningMessage[scanResult.color]}
              </span>
            </div>
            {/* <p>{scanResult.conclusion}</p> */}
            <div>
              <h3 className="font-bold text-lg">Evaluation</h3>
              <p>{scanResult.evaluation}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full mx-auto p-2">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue={activeTab}
        className="w-full"
      >
        <TabsContent value="transaction">
          <Card className="bg-transparent transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]  space-y-3 p-4 border rounded-xl">
            <CardHeader>
            <div className="text-white rounded-full p-4 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit mb-4"><ArrowLeftRight /></div>
              <CardTitle>Simulated Transaction Validator</CardTitle>
              <CardDescription>
                Before you hit "send" on that Solana transaction, let our tool
                do the heavy lifting. We simulate and scrutinize the transaction
                details, giving you a clear, human-readable report on whether
                it's malicious.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  value={transactionSignature}
                  onChange={(e) => inputChangeHandler(e, "Transaction")}
                  placeholder="Enter transaction hash or details"
                  className="flex-grow"
                />
                <Button
                  className="rounded-xl"
                  onClick={() => simulateScan("Transaction")}
                  disabled={isScanning}
                >
                  {isScanning ? "Scanning..." : <>Scan</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="address">
          <div className="flex justify-center items-center">
            <Card className="w-12/12 h-full bg-transparent transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]  space-y-3 p-4 border rounded-xl">
              <CardHeader>
                <div className="text-white rounded-full p-4 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-receipt-text"
                  >
                    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                    <path d="M14 8H8" />
                    <path d="M16 12H8" />
                    <path d="M13 16H8" />
                  </svg>{" "}

                  </div>
               <CardTitle>Contract Address Checker</CardTitle>
                <CardDescription>
                  Before you or your wallet interact with any contract, use our
                  analyzer to ensure the activity is safe. Know what's under the
                  hood before committing and be confident in your decisions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <Input
                    value={contractAddress}
                    onChange={(e) => inputChangeHandler(e, "ContractAddress")}
                    placeholder="Enter contract address"
                    className="flex-grow"
                  />
                  <Button
                  className="rounded-xl"
                    onClick={() => simulateScan("ContractAdress")}
                    disabled={isScanning}
                  >
                    {isScanning ? "Checking..." : "Check"}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
        <TabsContent value="contract">
          <Card className="bg-black bg-transparent transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset]  space-y-3 p-4 border rounded-xl">
            <CardHeader>
                <div className="text-white rounded-full p-4 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit mb-4">
                <ShieldCheck />
                </div>
              <CardTitle>Smart Contract Auditing</CardTitle>
              <CardDescription>
                Our comprehensive auditing tool dives deep into smart contracts,
                identifying every vulnerability and issue. Secure your contracts
                with precision.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Textarea
                  rows={9}
                  // visibleRows={9}
                  value={smartContract}
                  onChange={(e) => inputChangeHandler(e, "SmartContract")}
                  placeholder="Enter contract code or address"
                  className="flex-grow overflow-hidden bg-transparent"
                />
                <Button
                  className="rounded-xl"
                  onClick={() => simulateScan("SmartContract")}
                  disabled={isScanning}
                >
                  {isScanning ? "Auditing..." : "Audit"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-700 min-w-full md:min-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Scan Results</DialogTitle>
            <DialogDescription>{scanResult?.conclusion}</DialogDescription>
          </DialogHeader>
          {renderScanResult()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
