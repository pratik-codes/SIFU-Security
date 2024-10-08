"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Wallet } from "lucide-react";



import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";





export default function SolanaPool({
  mainTitle,
  mainDescription,
  contractAddress,
  poolType,
}: any) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<any>([])
  const [poolBalance, setPoolBalance] = useState(1000000) // 1 SOL
  const [userDeposit, setUserDeposit] = useState(0)
  const [amount, setAmount] = useState("")

  const simulateDelay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms))

  const connectWallet = async () => {
    setIsLoading(true)
    await simulateDelay(2000)
    setIsConnected(true)
    setIsLoading(false)
     toast({
       title: "Success",
       description: "Wallet connected successfully.",
       variant: "default",
     })
  }

  const deposit = async () => {
    const depositAmount = Number(amount) * 1000000 // Convert to lamports
    if (depositAmount > 0) {
      setIsLoading(true)
      await simulateDelay(2000)
      setPoolBalance((prev) => prev + depositAmount)
      setUserDeposit((prev) => prev + depositAmount)
      setAmount("")
      setHistory([
        ...history,
        {
          type: "deposit",
          amount: depositAmount,
          poolType,
        },
      ])
      setIsLoading(false)
     toast({
       title: "Success",
       description: "Deposit successful!",
       variant: "default",
     })
    }
  }

  const withdraw = async () => {
    const withdrawAmount = Number(amount) * 1000000 // Convert to lamports
    if (withdrawAmount > 0) {
      setIsLoading(true)
      await simulateDelay(4000)
      console.log("withdrawAmount", withdrawAmount)
      console.log("userDeposit", userDeposit)
      if (withdrawAmount <= userDeposit) {
        setPoolBalance((prev) => prev - withdrawAmount)
        setUserDeposit((prev) => prev - withdrawAmount)
      } else {
        if (withdrawAmount > userDeposit && poolType === "sifu") {
          toast({
            title: "Error",
            description: "Transaction failed",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
        const remainingWithdraw = withdrawAmount - userDeposit
        setPoolBalance((prev) => prev - withdrawAmount)
        setUserDeposit(0)
        toast({
          title: "Info",
          description: `Withdrew ${userDeposit / 1000000} SOL from your deposit and ${
            remainingWithdraw / 1000000
            } SOL from the pool.`,
          variant: "default",
        })
      }
      setAmount("")
      setIsLoading(false)
      toast({
        title: "Success",
        description: "Withdrawal successful!",
        variant: "default",
      })
    }
  }

  return (
    <div className="ml-3 md:ml-8 rounded-full] flex items-center justify-center p-4">
      <Card className="transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] ml-3 md:ml-8 rounded-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {mainTitle}
          </CardTitle>
          <CardDescription>
            {mainDescription}
          </CardDescription>
           <CardDescription>
            <span>Contract address: {contractAddress}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <Button
              onClick={connectWallet}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                "Please approve and connect the wallet..."
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" /> Connect Wallet
                </>
              )}
            </Button>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Pool Balance:</span>
                  <span>{(poolBalance / 1000000).toFixed(4)} SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Your Deposit:</span>
                  <span>{(userDeposit / 1000000).toFixed(4)} SOL</span>
                </div>
                <Input
                  type="number"
                  placeholder="Amount (in SOL)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </>
          )}
        </CardContent>
        {isConnected && (
          <CardFooter className="flex justify-between">
            <Button
              onClick={deposit}
              className="flex-1 mr-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <ArrowUp className="mr-2 h-4 w-4" /> Deposit
                </>
              )}
            </Button>
            <Button
              onClick={withdraw}
              className="flex-1 ml-2"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processing..."
              ) : (
                <>
                  <ArrowDown className="mr-2 h-4 w-4" /> Withdraw
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
