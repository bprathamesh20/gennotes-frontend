"use client"

import { useState, useEffect, useRef } from "react"
import HtmlPreview from "@/components/html-preview"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp, Square } from "lucide-react"

export default function Home() {
  const [query, setQuery] = useState<string>("")
  const [result, setResult] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false) // Add isLoading state
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
    }
  }, [])

  const handleSubmit = async () => { // Modify to accept no arguments directly
    const inputQuery = query // Get query from state
    if (!inputQuery.trim()) return // Prevent submission if empty

    setIsLoading(true) // Set loading state for the new component
    setQuery(inputQuery)
    setIsSubmitted(true)

    // Clear any existing interval
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current)
    }

    const loadingMessages = [
      "Initiating request...",
      "Gathering information using DuckDuckGo...",
      "Searching for relevant visual aids on Google Images...",
      "Analyzing search results...",
      "Crawling relevant webpages for deeper insights...",
      "Synthesizing information from multiple sources...",
      "Structuring notes and key concepts...",
      "Identifying key definitions...",
      "Adding examples and applications...",
      "Formatting visual aid descriptions...",
      "Finalizing the notes structure...",
      "Almost there, compiling the final response...",
    ]
    let messageIndex = 0
    const totalDuration = 120000 // 2 minutes in milliseconds
    const intervalTime = totalDuration / loadingMessages.length

    // Set initial loading message
    setResult(`<p>${loadingMessages[messageIndex]}</p>`)
    messageIndex++

    // Start interval to cycle through messages
    loadingIntervalRef.current = setInterval(() => {
      if (messageIndex < loadingMessages.length) {
        setResult(`<p>${loadingMessages[messageIndex]}</p>`)
        messageIndex++
      } else {
        // Keep showing the last message if the interval finishes before the fetch
        // Or clear interval if we want it to stop after messages are done
         if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      }
    }, intervalTime)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: inputQuery }),
      })

      // Clear interval once fetch is complete
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      let htmlContent = data.html_content || "<p>No content received.</p>"

      // Remove potential markdown code block fences
      htmlContent = htmlContent.replace(/^```html\n?/, "").replace(/```$/, "")

      setResult(htmlContent)
    } catch (error) {
       // Clear interval on error
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
        loadingIntervalRef.current = null
      }
      console.error("Error fetching data:", error)
      setResult(`<p style="color: red;">Error fetching data: ${error instanceof Error ? error.message : String(error)}</p>`)
    } finally {
       setIsLoading(false) // Ensure loading state is reset
       // Clear interval just in case it's still running after error/completion
       if (loadingIntervalRef.current) {
         clearInterval(loadingIntervalRef.current)
         loadingIntervalRef.current = null
       }
    }
  }

  return (
    <main className="min-h-screen p-3 text-gray-900">
      <div
        className={`transition-all duration-300 ${isSubmitted ? "flex flex-col md:flex-row gap-4" : "flex flex-col justify-center items-center min-h-screen"}`}
      > {/* Adjusted for vertical centering */}
        {!isSubmitted && (
          <div>
          <h1 className="text-3xl font-semibold mb-3 text-center">What can I help you learn?</h1>
          <p className="text-sm text-gray-600 mb-3 text-center">Ask me about your syllabus topics or give me questions to solve</p>
          </div>
        )}
        <div className={`${isSubmitted ? "w-full md:w-1/3" : "w-full max-w-2xl"}`}>
          {/* Replace QueryInput with PromptInput structure */}
          <PromptInput
            value={query}
            onValueChange={setQuery} // Use setQuery directly
            isLoading={isLoading}
            onSubmit={handleSubmit} // Pass the modified handleSubmit
            className="w-full" // Adjust width as needed
          >
            <PromptInputTextarea placeholder="Ask me about any topic..." />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip={isLoading ? "Stop generation (Not implemented)" : "Send message"} // Update tooltip
              >
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSubmit} // Trigger submit on click
                  disabled={isLoading || !query.trim()} // Disable button when loading or input is empty
                >
                  {isLoading ? (
                    <Square className="size-5 fill-current" /> // Use Square for loading
                  ) : (
                    <ArrowUp className="size-5" /> // Use ArrowUp otherwise
                  )}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>

        {isSubmitted && (
          <div className="w-full md:w-2/3 mt-4 md:mt-0">
            <HtmlPreview html={result} />
          </div>
        )}
      </div>
    </main>
  )
}
