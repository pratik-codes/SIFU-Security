"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Loader2, Terminal } from "lucide-react"

import { DetectionApiData } from "@/config/detection-apis"
import { DetectionApiCall } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

export default function ScanPreview() {
  const [activeTab, setActiveTab] = useState("smart-contract")
  const [smartContract, setSmartContract] = useState(
    DetectionApiData.SmartContract.body.contract_code
  )
  const [walletAddress, setWalletAddress] = useState(
    DetectionApiData.Wallet.body.contract_address
  )
  const [transactionSignature, setTransactionSignature] = useState(
    DetectionApiData.Transaction.body.tx_signature
  )
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState({ score: 0, conclusion: "" })

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
    setIsScanning(true)

    let res: any = {}
    switch (type) {
      case "Smart Contract":
        if (!smartContract) {notifyNoData(); return}
        res = await DetectionApiCall(DetectionApiData.SmartContract)
        handleScanApiCall(res)
        break
      case "Wallet":
        if (!walletAddress) {notifyNoData(); return}
        res = await DetectionApiCall(DetectionApiData.Wallet)
        handleScanApiCall(res)
        break
      case "Transaction":
        if (!transactionSignature) {notifyNoData(); return}
        res = await DetectionApiCall(DetectionApiData.Transaction)
        handleScanApiCall(res)
        break
    }

    setIsScanning(false)
  }

  useEffect(() => {
    console.log({ scanResult })
  }, [scanResult])

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="mt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="smart-contract">Smart Contract</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>
          <TabsContent value="smart-contract">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleScan("Smart Contract")
              }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Enter smart contract code here"
                value={smartContract}
                onChange={(e) => setSmartContract(e.target.value)}
                className="min-h-[200px]"
              />
              <Button type="submit" className="w-full" disabled={isScanning}>
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan Smart Contract"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="wallet">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleScan("Wallet")
              }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Enter wallet address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="min-h-[200px]"
              />
              <Button type="submit" className="w-full" disabled={isScanning}>
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan Wallet"
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="transactions">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleScan("Transaction")
              }}
              className="space-y-4"
            >
              <Textarea
                placeholder="Enter transaction signature"
                value={transactionSignature}
                onChange={(e) => setTransactionSignature(e.target.value)}
                className="min-h-[200px]"
              />
              <Button type="submit" className="w-full" disabled={isScanning}>
                {isScanning ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Scan Transaction"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        {scanResult.score !== 0 && (
          <div className="p-2 space-y-4 mt-6">
            {scanResult && (
              <Alert variant="destructive">
                <AlertCircle className="h-6 w-6 my-auto" />
                <AlertTitle className="ml-2 font-extrabold text-lg">
                  Warning
                </AlertTitle>
                <AlertDescription className="font-bold ml-2">
                  The following issues were found in the scanned data:
                </AlertDescription>
              </Alert>
            )}
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle className="font-extrabold">Conclusion</AlertTitle>
              <AlertDescription>{scanResult?.conclusion}</AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
