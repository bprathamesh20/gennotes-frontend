"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Import useRouter
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react" // Remove Square import

export default function Home() {
  const [query, setQuery] = useState<string>("")
  const router = useRouter() // Initialize useRouter

  const handleSubmit = () => {
    if (!query.trim()) return // Prevent submission if empty

    // Navigate to the results page with the query as a parameter
    router.push(`/results?q=${encodeURIComponent(query)}`)
  }

  return (
    <main className="min-h-screen p-3 text-gray-900">
      {/* Center content vertically and horizontally */}
      <div className="flex flex-col justify-center items-center min-h-screen">
        {/* Title and description */}
        <div>
          <h1 className="text-3xl font-semibold mb-3 text-center">What can I help you learn?</h1>
          <p className="text-sm text-gray-600 mb-3 text-center">Ask me about your syllabus topics or give me questions to solve</p>
        </div>
        {/* Input area */}
        <div className="w-full max-w-2xl">
          {/* Replace QueryInput with PromptInput structure */}
          <PromptInput
            value={query}
            onValueChange={setQuery} // Use setQuery directly
            // isLoading prop is removed as it's no longer managed here
            onSubmit={handleSubmit} // Pass the modified handleSubmit
            className="w-full" // Adjust width as needed
          >
            <PromptInputTextarea placeholder="Ask me about any topic..." />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip={"Send message"} // Simplified tooltip
              >
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSubmit} // Trigger submit on click
                  disabled={!query.trim()} // Disable button only when input is empty
                >
                  <ArrowUp className="size-5" /> {/* Always show ArrowUp */}
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>

        {/* Removed the HtmlPreview section */}
      </div>
    </main>
  )
}
