"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, FileText, Clipboard, Check } from "lucide-react"

export function MedicalCodingForm() {
  const [feedback, setFeedback] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("input")
  const [copied, setCopied] = useState(false)

  const API_URL = "https://icd-10-production.up.railway.app/api/process-feedback" // Adjust for local testing if needed

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!feedback.trim()) {
      setError("Please enter medical conditions to code")
      return
    }

    setLoading(true)
    setError(null)
    setResponse("") // Clear previous response
    setActiveTab("results")

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback }),
      })

      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`)
      }

      if (!res.body) {
        throw new Error('Response body is null')
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          setResponse((prev) => prev + chunk)
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process request"
      setError(errorMessage)
      setActiveTab("input")
    } finally {
      setLoading(false)
    }
  }

  const examples = [
    "Acute myocardial infarction",
    "Type 2 diabetes mellitus with diabetic nephropathy",
    "Bacterial pneumonia",
    "Major depressive disorder, recurrent",
  ]

  const handleExampleClick = (example: string) => {
    setFeedback(example)
  }

  const copyToClipboard = () => {
    const tempElement = document.createElement("div")
    tempElement.innerHTML = response
    const textToCopy = tempElement.textContent || tempElement.innerText || ""

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="space-y-6 mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="input"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <FileText className="h-4 w-4" />
            <span>Input</span>
          </TabsTrigger>
          <TabsTrigger
            value="results"
            disabled={!response && !loading}
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M8 2v4" />
              <path d="M16 2v4" />
              <path d="M3 10h18" />
              <path d="M4 6h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
              <path d="M12 14v-4" />
              <path d="M10 12h4" />
            </svg>
            <span>Results</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter medical conditions for ICD-10 coding..."
                className="min-h-[200px] resize-none focus-visible:ring-primary"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
              {error && (
                <Alert variant="destructive" className="animate-in fade-in-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process"
              )}
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm font-medium">Example conditions:</p>
            <div className="flex flex-wrap gap-2">
              {examples.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => handleExampleClick(example)}
                  className="text-xs hover:bg-primary hover:text-primary-foreground"
                >
                  {example}
                </Button>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results">
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {loading && (
                  <div className="flex justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                {response && (
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Clipboard className="h-4 w-4" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <div
                      className="prose prose-blue dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                  </div>
                )}
                {!response && !loading && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-primary/10 p-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-primary"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <path d="M3 10h18" />
                        <path d="M4 6h16a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" />
                        <path d="M12 14v-4" />
                        <path d="M10 12h4" />
                      </svg>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Submit medical conditions to see ICD-10 codes here
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}