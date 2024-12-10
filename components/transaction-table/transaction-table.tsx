"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Radio } from "lucide-react"

import { DetectionApiData } from "@/config/detection-apis"
import { DetectionApiCall, getTimeAgo } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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

import TransactionFilters from "./transaction-filters"

const contractNameIconUrl = {
  Jito: "https://assets.coingecko.com/coins/images/33228/standard/jto.png?1701137022",
  Jupiter: "https://cryptologos.cc/logos/jupiter-ag-jup-logo.svg",
  "Pump.fun": "https://pump.fun/icon.png?c2a22dd8671140c9",
  Drift:
    "https://www.alchemy.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Falchemy-website%2Fimage%2Fupload%2Fv1694675914%2Fdapp-store%2Fdapp-logos%2FDrift.jpg&w=640&q=75",
  "Mariande Finance":
    "https://www.alchemy.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Falchemy-website%2Fimage%2Fupload%2Fv1694675441%2Fdapp-store%2Fdapp-logos%2FMarinade%2520Finance.jpg&w=256&q=75",
}

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
  const [data, setData] = useState<Transaction[]>([])
  const [addingRows, setAddingRows] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    console.log(visibleRows)
  }, [visibleRows])

  const fetchTableData = async () => {
    const response = await DetectionApiCall(
      DetectionApiData.ContractTransactions
    )
    if (response?.ok) {
      return response?.data
    }
  }

  const getInitalData = async () => {
    // fetching table intial table data
    const data = await fetchTableData()

    const reversedData = data

    setData(reversedData)

    // addRows(reversedData, 400, false, true)
    const dataLengthMinus10 = data.length - 10
    const dataLength = data.length

    console.log("Data length", dataLength, dataLengthMinus10)
    addRows(reversedData.slice(dataLengthMinus10, dataLength), 400, false, true)
    if (reversedData.length > MAX_ROWS) {
      setTimeout(() => {
        addRows(reversedData.slice(0, dataLengthMinus10).reverse(), 1500, true)
      }, 7000)
    }
  }

  const addRows = async (
    data: any,
    intervalSeconds = 400,
    maxLimit = false,
    initialRender = false
  ) => {
    setAddingRows(true)
    let limit = 0
    if (data.length >= MAX_ROWS) {
      limit = 10
    } else {
      limit = data.length
    }

    if (maxLimit) {
      limit = data.length
    }

    console.log("Adding rows", limit)

    // Step 1: Render the next 8 records, one at a time, with a 400ms delay between each
    for (let i = 0; i < limit; i++) {
      console.log("Adding row", i, data[i])
      await new Promise((resolve) => setTimeout(resolve, intervalSeconds)) // 400ms delay between each record
      if (initialRender) {
        setVisibleRows((prev) => [...prev, data[i]])
      } else {
        setVisibleRows((prev) => [data[i], ...prev])
      }
    }

    setAddingRows(false)
  }

  // get all the unique daap name from the data and only calculate when the data changes
  const uniqueDaapNames = Array.from(
    new Set(data?.map((row) => row.contract_name))
  )

  const onFilterChange = (type = "all", name = "") => {
    setVisibleRows([]) // Clear the visible rows

    const filteredData = data.filter((row) => {
      return (
        (type === "all" || row.alert_status === type) &&
        (name === "" || row.contract_name === name)
      )
    })

    console.log("Filtered data", filteredData)

    // Progressive rendering for additional rows
    if (filteredData.length <= MAX_ROWS) {
      addRows(filteredData)
    }
    addRows(filteredData.slice(MAX_ROWS)) // Add the remaining rows with delay
  }

  useEffect(() => {
    if (!isFirstRender.current) return // Avoid running the effect on the second render in dev mode
    getInitalData()
    const interval = setInterval(addRows, 10000)
    isFirstRender.current = false
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative xl:w-8/12 md:w-7/12 mx-auto py-10 px-4 container">
      <div className="flex justify-end">
        <TransactionFilters
          daaps={uniqueDaapNames}
          onFilterSelect={(type, name) => onFilterChange(type, name)}
          addingRows={addingRows}
        />
      </div>
      <div className="text-white border-12 border-white">
        <div className="flex">
          <div className="absolute mt-[4rem] text-center absolute top-0 left-0 mt-6 transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] ml-3 md:ml-8 rounded-full">
            <Badge
              variant="outline"
              className="text-xs md:text-sm px-[0.3rem] bg-black"
            >
              On-Chain + Off-Chain realtime fraud analysis
              <Badge
                variant="destructive"
                className="bg-red-900 ml-2 text-xs md:text-sm"
              >
                <Radio className="h-4 w-4 mr-1" />
                Live
              </Badge>
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
                <TableHead className="text-gray-400 font-bold">
                  Status
                </TableHead>
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
              {isFirstRender.current &&
                Array.from({ length: MAX_ROWS }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-20 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Skeleton className="h-6 w-6 rounded-full mr-2" />
                        <Skeleton className="h-4 w-20 rounded" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-8 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24 rounded" />
                    </TableCell>
                  </TableRow>
                ))}
              <AnimatePresence initial={false}>
                {visibleRows.map((row, index) => (
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
                        <Image
                          src={
                            contractNameIconUrl[row.contract_name] ||
                            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_vY92rGy3lnjj_4FNLkxKJ8t2cwKQBRGrew&s"
                          }
                          alt={row.contract_name}
                          className="h-6 w-6 mr-2 bg-white rounded-full"
                          width={30}
                          height={30}
                        />
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
                            <TooltipContent>
                              <p className="max-w-xs">{row.analysis}</p>
                            </TooltipContent>
                          </TooltipTrigger>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="border-b border-muted/50">
                      {getTimeAgo(row.timestamp, index)}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
