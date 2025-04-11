"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, X, Download } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import html2pdf from 'html2pdf.js'

interface HtmlPreviewProps {
  html: string
}

export default function HtmlPreview({ html }: HtmlPreviewProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  return (
    <>
      <Card className=" text-black overflow-hidden border-0 rounded-xl shadow-lg">
        <CardHeader className="bg-gray-100 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              <div className="flex space-x-2 mr-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              Preview
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  // Use the raw HTML string directly
                  html2pdf().from(html).set({
                    // Optional: Add styling or options if needed, e.g., margin
                    margin: 1,
                    filename: 'preview.pdf',
                    // Ensure html2canvas captures the full content
                    html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
                    // jsPDF options if needed
                    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                  }).save();
                }}
                aria-label="Download preview as PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsFullScreen(true)}
                aria-label="Full page preview"
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div ref={previewRef} className="preview-container bg-white" dangerouslySetInnerHTML={{ __html: html }} />
        </CardContent>
      </Card>

      <Dialog open={isFullScreen} onOpenChange={setIsFullScreen}>
        <DialogContent className="max-w-[90vw] w-[90vw] max-h-[90vh] h-[90vh] p-0">
          <div className="flex flex-col h-full overflow-scroll">
            <div className="bg-gray-100 border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex space-x-2 mr-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm font-medium">Full Page Preview</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsFullScreen(false)}
                aria-label="Close full page preview"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto bg-white" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
