"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const BadgeColor = {
  HIGH: "bg-red-700",
  MEDIUM: "bg-yellow-700",
  LOW: "bg-green-700",
}

type Transaction = {
  signature: string
  alert_status: string
  custom_detection: string
  contract_name: string
  timestamp: string
  score: number
  analysis: string
  contract_address: string
}

const data: Transaction[] = [
  {
    signature:
      "6y4tAQs7wxRZj67D7tPSJsgQxoM86ER34FDG8YFASFFSDASFASEoN1uW8wP7odAr1HgUYtp71ByMNujs4WzNZ36V7efLNRjfLHEcUhH",
    alert_status: "HIGH",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jupiter",
    timestamp: "2024-09-12 14:05:12",
    score: 95,
    analysis:
      "Transaction failed due to slippage tolerance exceeded, indicating an attempt to exploit price fluctuations.",
    contract_address: "1 minute ago",
  },
  {
    signature:
      "5zbmPpLAEhCEi4epNYo1GkLmWhzbHajYg58cfafwJzPFT8g8J9KoUU7ChdBCpftxPdWgNnZe1K15vyJKrkeSbDDQPp",
    alert_status: "MEDIUM",
    custom_detection: "Suspicious Timing Found",
    contract_name: "Jito",
    timestamp: "1 minute ago",
    score: 90,
    analysis:
      "The transaction failed due to a gas limit error, suggesting potential inefficiency in contract execution.",
    contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
  },
  {
    signature:
      "4pq5XHhL1FrSkFBFYsdi4vDqdfo1ASD171eKmPKakof5CUHFnwoDWMB7p7snFu5WYuCVaSL1E54u2heMY99Yz2sKEVXg",
    alert_status: "LOW",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jupiter",
    timestamp: "10 minute ago",
    score: 75,
    analysis:
      "This transaction encountered a timeout error, possibly due to network latency or congestion.",
    contract_address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  },
  {
    signature:
      "8gQuJkQ3WFvon8vVKgaySkNfaZ4WxUFHx4kqBAhWAHSebeE1uYNK6J5uxeeLox5jAH28Fy6HtqCBN1otQ4bizhin",
    alert_status: "HIGH",
    custom_detection: "Anomaly in Contract Call",
    contract_name: "Jito",
    timestamp: "7 minute ago",
    score: 98,
    analysis:
      "The transaction failed because the contract's call function was interrupted, possibly due to an external force.",
    contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
  },
  {
    signature:
      "1y4tAQs7wxRZj67D7tPSJsgQxoM86ER45TWAVSEsEoN1uW8wP7odAr1HgUYtp71ByMNujs4WzNZ36V7efLNRjfLHEcUhH",
    alert_status: "MEDIUM",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jupiter",
    timestamp: "7 minute ago",
    score: 85,
    analysis:
      "Transaction failed due to a contract verification error, possibly a result of outdated code execution.",
    contract_address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  },
  {
    signature:
      "9bmPpLAEhCEi4epNYo1GkLmWhzbHajYg58cffsgsggsdfg7ChdBCpftxPdWgNnZe1K15vyJKrkeSbDDQPp",
    alert_status: "HIGH",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jito",
    timestamp: "6 minute ago",
    score: 100,
    analysis:
      "The transaction failed due to slippage tolerance exceeded, indicating attempts to manipulate price changes.",
    contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
  },
  {
    signature:
      "2pq5XHhL1FrSkFBFYsdi4vDqdfo181eKmPKakof5CUHFnwoDWMB7p7snFu5WYuCVaSL1E54u2heMY99Yz2sKEVXg",
    alert_status: "LOW",
    custom_detection: "Custom Fraud Found",
    contract_name: "Jupiter",
    timestamp: "5 minute ago",
    score: 60,
    analysis:
      "Detected abnormal behavior with the contract call which may suggest a custom fraud attempt.",
    contract_address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  },
  {
    signature:
      "7gQuJkQ3WFvon8vVKgaySkNfaZ4WxUFHx4kqBAhWAHSebeE1uYNK6J5uxeeLox5jAH28Fy6HtqCBN1otQ4bizhin",
    alert_status: "MEDIUM",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jito",
    timestamp: "5 minute ago",
    score: 88,
    analysis:
      "Failed due to gas fees not being met; possible inefficiency or misuse in contract logic.",
    contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
  },
  {
    signature:
      "4y4tAQs7wxRZj67D7tPSJsgQxoM86fsdfASFAWwP7odAr1HgUYtp71ByMNujs4WzNZ36V7efLNRjfLHEcUhHSsB93k",
    alert_status: "HIGH",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jupiter",
    timestamp: "4 minute ago",
    score: 99,
    analysis:
      "Transaction failed due to a gas limit exceeded error, which could indicate congestion or inefficiency in the contract.",
    contract_address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  },
  {
    signature:
      "5bmPpLAEhCEi4epNYo1GkLmWhzbHajYg58cfwJzPFT8g8J9KoUU7ChdBCpftxPdWgNnZe1K15vyJKrkeSbDDQPp",
    alert_status: "MEDIUM",
    custom_detection: "Unusual Contract Activity",
    contract_name: "Jito",
    timestamp: "3 minute ago",
    score: 93,
    analysis:
      "Transaction failed due to unusual contract call patterns, potentially indicating an exploit attempt.",
    contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
  },
  {
    signature:
      "3pq5XHhL1FrSkFBFYsdi4vDqdfo151eKmPKakof5CUHFnwoDWMB7p7snFu5WYuCVaSL1E54u2heMY99Yz2sKEVXg",
    alert_status: "HIGH",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jupiter",
    timestamp: "2 minute ago",
    score: 98,
    analysis:
      "Transaction failed due to a timeout, likely caused by high network congestion during execution.",
    contract_address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4",
  },
  {
    signature:
      "39bmPpLAEhCEi4epNYo1GkLASDFASDFmWhzbHajYg58cffgsdfgsdfwJzPFT8g8J9KoUU7ChdBCpftxPdWgNnZe1K15vyJKrkeSbDDQPp",
    alert_status: "HIGH",
    custom_detection: "No Custom Fraud Found",
    contract_name: "Jito",
    timestamp: "1 minute ago",
    score: 100,
    analysis:
      "The transaction failed due to a slippage tolerance exceeded error. This indicates an attempt to exploit the contract by trying to take advantage of price fluctuations.",
    contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
  },
]

const MAX_ROWS = 10

export default function TransactionTable() {
  const [visibleRows, setVisibleRows] = useState<Transaction[]>([])
  const isFirstRender = useRef(true)

  const getInitalData = async () => {
    if (!isFirstRender.current) return // Avoid running the effect on the second render in dev mode

    const addRows = async () => {
      const reversedData = [...data].reverse() // Reverse the data to render from the last record

      // Step 1: Render the next 8 records, one at a time, with a 400ms delay between each
      for (let i = 0; i < 10 && i < reversedData.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 400)) // 400ms delay between each record
        setVisibleRows((prev) => [...prev, reversedData[i]])
      }
    }

    addRows()
    isFirstRender.current = false
 }

  useEffect(() => {
    getInitalData()

    const interval = setInterval(addNewData, 10000)
    return () => clearInterval(interval)
  }, [])


  const addNewData = useCallback(() => {
    const newItem: Transaction = {
      signature: `${Math.random().toString(36).substr(2, 9)}...`,
      alert_status: ["HIGH", "LOW", "MEDIUM"][Math.floor(Math.random() * 3)],
      contract_name: ["Jito", "Jupiter"][Math.floor(Math.random() * 2)],
      timestamp: "some seconds ago",
      score: [100, 89, 76, 93][Math.floor(Math.random() * 4)],
      analysis:
        "The transaction failed due to a slippage tolerance exceeded error. This indicates an attempt to exploit the contract by trying to take advantage of price fluctuations.",
      contract_address: "Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb",
      custom_detection: "No Custom Fraud Found",
    }

    setVisibleRows((prevData) => [newItem, ...prevData.slice(0, 9)])
  }, [])

  return (
    <div className="container relative md:w-7/12 mx-auto py-10 px-4 text-white border-12 border-white">
      <div className="flex">
        <div className="text-center mb-1 mr-1 absolute top-0 left-0 mt-6 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] ml-8 rounded-full">
          <Badge variant="outline" className="text-sm">
            Realtime transactions powered by SIFU
          </Badge>
        </div>
      </div>
      <div className="w-full text-white rounded-3xl p-4 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] w-fit mb-4 shadow-xl rounded-2xl p-2 border px-8 pt-2 min-h-[45rem] max-h-[45rem] overflow-hidden">
        <Table className="border-separate border-spacing-0 border-spacing-y-2 overflow-hidden">
          <TableHeader>
            <TableRow className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <TableHead className="text-gray-400 font-bold">
                Signature
              </TableHead>
              <TableHead className="text-gray-400 font-bold">Status</TableHead>
              <TableHead className="text-gray-400 font-bold">
                Contract
              </TableHead>
              <TableHead className="text-gray-400 font-bold">Score</TableHead>
              <TableHead className="text-gray-400 font-bold">
                Analysis
              </TableHead>
              <TableHead className="text-gray-400 font-bold">
                Timestamp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence initial={false}>
              {visibleRows.map((row) => (
                <motion.tr
                  key={row.signature}
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.5 }}
                  layout
                  className="transition-colors hover:bg-muted/50 "
                >
                  <TableCell className="font-mono text-xs border-b border-muted/50">
                    {row.signature.slice(0, 10)}...
                  </TableCell>
                  <TableCell className="border-b border-muted/50">
                    <Badge
                      className={`font-bold ${BadgeColor[row.alert_status]}`}
                    >
                      {row.alert_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="border-b border-muted/50 flex items-center">
                    {row.contract_name === "Jito" ? (
                      <Image
                        src="https://assets.coingecko.com/coins/images/33228/standard/jto.png?1701137022"
                        alt={row.contract_name}
                        className="h-6 w-6 mr-2 bg-white rounded-full"
                        width={30}
                        height={30}
                      />
                    ) : (
                      <Image
                        src="https://cryptologos.cc/logos/jupiter-ag-jup-logo.svg"
                        alt={row.contract_name}
                        className="h-6 w-6 mr-2"
                        width={30}
                        height={30}
                      />
                    )}
                    {row.contract_name}
                  </TableCell>
                  <TableCell className="border-b border-muted/50 font-bold text-md">
                    {row.score}
                  </TableCell>
                  <TableCell className="border-b border-muted/50">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="max-w-xs">
                            {row.analysis.substring(0, 31)}...
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{row.analysis}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="border-b border-muted/50">
                    {row.timestamp}
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
