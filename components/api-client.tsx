"use client"

import { useState } from "react"
// import { SendHorizontal, Code, Loader2 } from 'lucide-react'
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

import { Spotlight } from "./spotlight"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export default function ApiClient() {
  const [method, setMethod] = useState("POST")
  const [url, setUrl] = useState("")
  const [scanType, setScanType] = useState("")
  const [body, setBody] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResponse(
        JSON.stringify(
          {
            method,
            url,
            scanType,
            body: body ? JSON.parse(body) : {},
            message:
              "This is a mock response. In a real application, this would be the API response.",
          },
          null,
          2
        )
      )
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Spotlight
        className="-top-50 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <Card className="bg-background shadow-lg border border-border">
        <CardContent className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Select
                defaultValue="Scan wallet"
                value={method}
                onValueChange={setMethod}
              >
                <SelectTrigger className="w-full sm:w-[100px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="text"
                placeholder="Enter API URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-grow"
              />
              <Select value={scanType} onValueChange={setScanType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select scan type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">
                    Scan transactions
                  </SelectItem>
                  <SelectItem value="contract">Scan contract</SelectItem>
                  <SelectItem value="wallet">Scan wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea
              placeholder="Enter JSON body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px] bg-muted/50"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>Processing...</>
              ) : (
                <>
                  {/* <SendHorizontal className="mr-2 h-4 w-4" /> */}
                  Send Request
                </>
              )}
            </Button>
          </form>
          {response && (
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-2 text-foreground flex items-center">
                Response:
              </h2>
              <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto border border-border">
                <code>{response}</code>
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
