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

  // Define suggestions
  const suggestions = [
    "Explain the concept of photosynthesis",
    "Summarize the plot of Hamlet",
    "What are the main causes of World War I?",
    "Create study notes for the Krebs cycle",
    "Compare and contrast mitosis and meiosis",
  ];

  const handleSubmit = () => {
    if (!query.trim()) return // Prevent submission if empty

    // Navigate to the results page with the query as a parameter
    router.push(`/results?q=${encodeURIComponent(query)}`)
  }

  return (
    <main className="flex flex-col justify-center items-center h-full text-gray-900"> {/* Center content, take full container height */}
      {/* Center content vertically and horizontally */}
      <div className="flex flex-col items-center w-full max-w-4xl px-4"> {/* Removed min-h-screen, added padding and max-width */}
        {/* Title and description */}
        <div>
          <h1 className="text-3xl font-semibold mb-3 text-center [letter-spacing:-0.06em]">What can I help you learn?</h1>
          <p className="text-sm text-gray-600 mb-3 text-center">Ask me about your syllabus topics or give me questions to solve</p>
        </div>
        {/* Input area */}
        <div className="w-full max-w-2xl ">
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

          {/* Suggestions Section */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 px-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setQuery(suggestion)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Removed the HtmlPreview section */}
      </div>
    </main>
  )
}
