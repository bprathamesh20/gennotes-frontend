"use client"

import type React from "react"

import { useState } from "react"
import { Send, Mic, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QueryInputProps {
  onSubmit: (query: string) => void
  isSubmitted: boolean
}

export default function QueryInput({ onSubmit, isSubmitted }: QueryInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onSubmit(inputValue)
    }
  }

  return (
    <div className={`transition-all duration-300 ${isSubmitted ? "" : "text-center"}`}>
      {!isSubmitted && <h1 className="text-3xl font-bold mb-8">What can I help with?</h1>}

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-xl border border-gray-700 bg-gray-800 shadow-sm">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything"
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          />

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <Button type="button" size="icon" variant="ghost" className="rounded-full">
              <Plus className="h-4 w-4" />
            </Button>
            <Button type="button" size="icon" variant="ghost" className="rounded-full">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button type="button" size="icon" variant="ghost" className="rounded-full">
              <Mic className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-white text-black hover:bg-gray-200"
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
