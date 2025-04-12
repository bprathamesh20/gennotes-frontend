"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from 'next/dynamic'

const HtmlPreview = dynamic(() => import('@/components/html-preview'), { ssr: false })
import { Skeleton } from "@/components/ui/skeleton"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

// Wrapper component to use useSearchParams
function ResultsContent() {
  const searchParams = useSearchParams()
  const queryParam = searchParams.get("q") || "" // Get query from URL

  const [result, setResult] = useState<string>("")
  const [references, setReferences] = useState<Array<{ title: string; href: string }>>([]) // State for references
  const [isLoading, setIsLoading] = useState<boolean>(true) // Start loading immediately
  const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Clear interval on component unmount
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current)
      }
    }
  }, [])

  // Fetch data when queryParam changes (on initial load)
  useEffect(() => {
    if (!queryParam) {
        setResult("<p>No query provided.</p>")
        setIsLoading(false)
        return;
    };

    const fetchData = async () => {
      setIsLoading(true)
      setResult("") // Clear previous results
      setReferences([]) // Clear previous references

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
          if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
        }
      }, intervalTime)

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: queryParam }), // Use query from URL
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

        // Extract HTML content
        let htmlContent = data.html_content || "<p>No content received.</p>"
        htmlContent = htmlContent.replace(/^```html\n?/, "").replace(/```$/, "")
        setResult(htmlContent)

        // Extract References from tool message
        if (data.messages && Array.isArray(data.messages)) {
          const toolMessage = data.messages.find((msg: any) => msg.role === "tool")
          if (toolMessage && toolMessage.content && Array.isArray(toolMessage.content)) {
            try {
              const extractedRefs = toolMessage.content
                .filter((item: any) => typeof item === 'string') // Process only string items (JSON arrays)
                .flatMap((jsonString: string) => {
                  try {
                    const parsedArray = JSON.parse(jsonString);
                    // Filter out image arrays and keep only reference objects
                    if (Array.isArray(parsedArray) && parsedArray.length > 0 && typeof parsedArray[0] === 'object' && parsedArray[0] !== null && 'href' in parsedArray[0] && 'title' in parsedArray[0]) {
                      return parsedArray.map((ref: any) => ({
                        title: ref.title,
                        href: ref.href,
                      }));
                    }
                    return []; // Return empty array if it's not the expected format (e.g., image array)
                  } catch (parseError) {
                    console.warn("Failed to parse reference JSON string:", parseError);
                    return []; // Ignore strings that aren't valid JSON arrays of references
                  }
                });
              setReferences(extractedRefs);
            } catch (error) {
              console.error("Error processing references:", error);
              setReferences([]); // Reset references on error
            }
          }
        }
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
         // Clear interval just in case it's still running
         if (loadingIntervalRef.current) {
           clearInterval(loadingIntervalRef.current)
           loadingIntervalRef.current = null
         }
      }
    }

    fetchData()
  }, [queryParam]) // Re-run fetch if queryParam changes

  return (
    // Make main container fill height and use flex column layout
    <main className="flex flex-col h-full p-3 text-gray-900">
      {/* Make flex row grow to fill available vertical space */}
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        {/* Input Area (1/3 width on md+) */}
        <div className="w-full md:w-1/3">
          <PromptInput
            value={queryParam} // Display the query from URL
            className="w-full"
          >
            <PromptInputTextarea
              placeholder="Your query..."
              readOnly // Make textarea read-only
            />
            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction tooltip={"Query used for this result"}>
                <Button
                  variant="default"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  disabled // Disable the button
                >
                  <ArrowUp className="size-5" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>

          {/* References Section */}
          {!isLoading && references.length > 0 && (
            <div className="mt-6 p-4 border rounded-md bg-gray-50">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">References Used</h3>
              <ul className="list-disc pl-5 space-y-1">
                {references.map((ref, index) => (
                  <li key={index} className="text-sm">
                    <a
                      href={ref.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-words"
                    >
                      {ref.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Preview Area (2/3 width on md+) - Make it a flex column */}
        <div className="w-full md:w-2/3 mt-4 md:mt-0 flex flex-col">
          {/* Conditional Rendering for Loading/Preview */}
          {isLoading && !result ? (
            // Skeleton takes full height available in this column
            <Skeleton className="w-full flex-1" />
          ) : (
            // HtmlPreview takes full height available in this column
            // We will modify HtmlPreview to accept className and apply flex-1
            result && <HtmlPreview html={result} className="flex-1" />
          )}
        </div>
      </div>
    </main>
  )
}

// Wrap the component in Suspense for useSearchParams
export default function ResultsPage() {
    return (
        <Suspense fallback={<Skeleton className="w-full h-screen" />}>
            <ResultsContent />
        </Suspense>
    )
}