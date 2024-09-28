"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"

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
import { DetectionApiCall, getTimeAgo } from "@/lib/utils"
import { DetectionApiData } from "@/config/detection-apis"
import { Skeleton } from "@/components/ui/skeleton"

const BadgeColor = {
  HIGH: "bg-red-700",
  MEDIUM: "bg-yellow-700",
  LOW: "bg-green-700",
}

const MAX_ROWS = 10

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

export default function TransactionTable() {
  const [visibleRows, setVisibleRows] = useState<Transaction[]>([])
  const isFirstRender = useRef(true)

  const fetchTableData = async (initialData = false) => {
    console.log("Fetching data...", initialData);
    const response = await DetectionApiCall(DetectionApiData.ContractTransactions);
    if (response?.ok) {
      return response?.data;
    }
  };

  const getInitalData = async () => {
    if (!isFirstRender.current) return // Avoid running the effect on the second render in dev mode

    // fetching table intial table data
    const data = await fetchTableData(true);

    const reversedData = data;

    const addRows = async (reversedData: any) => {
      // Step 1: Render the next 8 records, one at a time, with a 400ms delay between each
      for (let i = 0; i < MAX_ROWS && i < reversedData.length; i++) {
        console.log("Adding row", i, reversedData[i]);
        await new Promise((resolve) => setTimeout(resolve, 400)) // 400ms delay between each record
        setVisibleRows((prev) => [...prev, reversedData[i]])
      }
    }
    addRows(reversedData);

    isFirstRender.current = false
  }

  const getRealTimeData = async () => {
    const data = await fetchTableData();
    const reversedData = data;
    const addRows = async (reversedData: any) => {
      // Step 1: Render the next 8 records, one at a time, with a 400ms delay between each
      for (let i = 0; i < MAX_ROWS && i < reversedData.length; i++) {
        console.log("Adding row", i, reversedData[i]);
        await new Promise((resolve) => setTimeout(resolve, 180000)) // delay before adding the row
        setVisibleRows((prev) => [...prev, reversedData[i]])
      }
    }
    addRows(reversedData);
  };


  useEffect(() => {
    getInitalData();
    const interval = setInterval(getRealTimeData, 50000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container relative md:w-7/12 mx-auto py-10 px-4 text-white border-12 border-white">
      <div className="flex">
        <div className="text-center mb-1 mr-1 absolute top-0 left-0 mt-6 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] ml-3 md:ml-8 rounded-full">
          <Badge variant="outline" className="text-xs md:text-sm px-[0.3rem] bg-black">
            On-Chain + Off-Chain realtime fraud analysis for smart contracts <Badge variant="destructive" className="bg-red-900 ml-2 text-xs md:text-sm">Live</Badge>
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
            {isFirstRender.current && (
              Array.from({ length: MAX_ROWS }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-20 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Skeleton className="h-6 w-6 rounded-full mr-2" />
                      <Skeleton className="h-4 w-20 rounded" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-8 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32 rounded" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 rounded" /></TableCell>
                </TableRow>
              ))
            )}
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
                  <TableCell className="border-b border-muted/50">
                    <div className="flex items-center h-full">
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
                    </div>
                  </TableCell>
                  <TableCell className="border-b border-muted/50 font-bold text-md">
                    {row.score}
                  </TableCell>
                  <TableCell className="border-b border-muted/50">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <p className="max-w-xs">
                            {row.analysis.substring(0, 30)}...
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{row.analysis}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="border-b border-muted/50">
                    {getTimeAgo(row.timestamp)}
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
