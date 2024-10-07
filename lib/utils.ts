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

export const getTimeAgo = (timestamp: string) => {
  // Replace the space between date and time with 'T' to make it ISO-compliant
  const isoTimestamp = timestamp.replace(' ', 'T') + 'Z'; // Adding 'Z' to indicate UTC

  const now = new Date(); // Current time in UTC
  const time = new Date(isoTimestamp); // Parsed time in UTC
  const secondsAgo = Math.floor((now.getTime() - time.getTime()) / 1000); // Calculate time difference in seconds

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `${minutesAgo} minutes ago`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `${hoursAgo} hours ago`;
  } else {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `${daysAgo} days ago`;
  }
};

export const getTransactionTimestamp = (): string => {
  const now = new Date();

  now.setUTCMinutes(now.getUTCMinutes() - 20);

  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const day = String(now.getUTCDate()).padStart(2, '0');

  const hours = String(now.getUTCHours()).padStart(2, '0');
  const minutes = String(now.getUTCMinutes()).padStart(2, '0');
  const seconds = String(now.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
