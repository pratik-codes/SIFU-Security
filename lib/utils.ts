import axios from "axios"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { env } from "@/env.mjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

export const DetectionApiCall = async ({ url, body, method }) => {
  try {
    const res = await axios({
      method: method,
      url: url,
      data: body,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
      },
    })
    console.log({ res })
    if (res) {
      return { ok: true, data: res.data.data }
    }
  } catch (error) {
    return { error: error, ok: false }
  }
}

export const getTimeAgo = (timestamp: string, idx: number) => {
  console.log({ idx })
  // Start with "10 seconds ago" and reduce by 1 second per idx
  const now = new Date()
  const adjustedNow = new Date(now)
  adjustedNow.setSeconds(now.getSeconds() - 10 - idx) // Start with 10 seconds ago and add idx

  const time = new Date(timestamp) // Parse the timestamp
  const secondsAgo = Math.floor((now.getTime() - adjustedNow.getTime()) / 1000)

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60)
    return `${minutesAgo} minutes ago`
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600)
    return `${hoursAgo} hours ago`
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400)
    return `${daysAgo} days ago`
  }
}

export const getTransactionTimestamp = (): string => {
  const now = new Date()

  now.setUTCDate(now.getUTCDate() - 30)

  const year = now.getUTCFullYear()
  const month = String(now.getUTCMonth() + 1).padStart(2, "0") // Months are zero-indexed
  const day = String(now.getUTCDate()).padStart(2, "0")

  const hours = String(now.getUTCHours()).padStart(2, "0")
  const minutes = String(now.getUTCMinutes()).padStart(2, "0")
  const seconds = String(now.getUTCSeconds()).padStart(2, "0")

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
