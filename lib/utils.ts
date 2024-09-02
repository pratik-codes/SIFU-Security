import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"

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
    const res = await axios.post(url, body, {
      headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
      }
    })
    console.log({ res });
    if (res) {
      return { ok: true, data: res.data.data };
    }

  } catch (error) {
    return { error: error, ok: false }
  }
}
