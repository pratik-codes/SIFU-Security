"use client";

import React, { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, CheckCircle2, Code2, FileSearch, Scan, ShieldCheck, XCircle } from "lucide-react";



import { DetectionApiData } from "@/config/detection-apis";
import { DetectionApiCall } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";



import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
import { trackEvent } from "@/lib/analytics";


export default function ScanPreview() {
  const [activeTab, setActiveTab] = useState("transaction")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [smartContract, setSmartContract] = useState(
    DetectionApiData.SmartContract.body.contract_code
  )
  const [walletAddress, setWalletAddress] = useState(
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
    switch (type) {
      case "SmartContract":
        if (!smartContract) {
          notifyNoData()
          return
        }
        res = await DetectionApiCall(DetectionApiData.SmartContract)
        handleScanApiCall(res)
        break
      case "ContractAdress":
        if (!walletAddress) {
          notifyNoData()
          return
        }
        res = await DetectionApiCall(DetectionApiData.ContractAddress)
        handleScanApiCall(res)
        break
      case "Transaction":
        if (!transactionSignature) {
          notifyNoData()
          return
        }
        res = await DetectionApiCall(DetectionApiData.Transaction)
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
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    switch (type) {
      case "SmartContract":
        // trim spaces from the input
        const trimmedInput = e.target.value.replace(/\s/g, "")
        setSmartContract(e.target.value.replace(/\s/g, ""))
        break
      case "ContractAddress":
        setWalletAddress(e.target.value.replace(/\s/g, ""))
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
              <span className="font-semibold">{scanResult.color}</span>
            </div>
            <p>{scanResult.conclusion}</p>
            <div>
              <h3 className="font-bold text-lg">Evaluation</h3>
              <p>{scanResult.evaluation}</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="transaction"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transaction">Transaction Validator</TabsTrigger>
          <TabsTrigger value="address">Address Checker</TabsTrigger>
          <TabsTrigger value="contract">Contract Auditing</TabsTrigger>
        </TabsList>
        <TabsContent value="transaction">
          <Card>
            <CardHeader>
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
          <Card>
            <CardHeader>
              <CardTitle>Contract Address Checker</CardTitle>
              <CardDescription>
                Before you or your wallet interact with any contract, use our
                analyzer to ensure the activity is safe. Know what's under the
                hood before committing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  value={walletAddress}
                  onChange={(e) => inputChangeHandler(e, "ContractAddress")}
                  placeholder="Enter contract address"
                  className="flex-grow"
                />
                <Button
                  onClick={() => simulateScan("ContractAdress")}
                  disabled={isScanning}
                >
                  {isScanning ? "Checking..." : "Check"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contract">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Auditing</CardTitle>
              <CardDescription>
                Our comprehensive auditing tool dives deep into smart contracts,
                identifying every vulnerability and issue. Secure your contracts
                with precision.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-4">
                <Input
                  value={smartContract}
                  onChange={(e) => inputChangeHandler(e, "SmartContract")}
                  placeholder="Enter contract code or address"
                  className="flex-grow"
                />
                <Button
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
      <div className="text-center">
        <Badge variant="outline" className="text-sm">
          Powered by SIFU
        </Badge>
      </div>
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
