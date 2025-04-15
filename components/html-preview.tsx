"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, X, Download, Printer } from "lucide-react" // Import Printer icon
import { Dialog, DialogContent } from "@/components/ui/dialog"
// Dynamically import html2pdf.js later

import { cn } from "@/lib/utils" // Import cn utility

interface HtmlPreviewProps {
  html: string
  className?: string // Add optional className prop
}

export default function HtmlPreview({ html, className }: HtmlPreviewProps) { // Destructure className
  const [isFullScreen, setIsFullScreen] = useState(false)
  const previewRef = useRef<HTMLIFrameElement>(null) // Change ref type to iframe

  return (
    <>
      {/* Apply the passed className using cn */}
      <Card className={cn("text-black overflow-hidden border-0 rounded-xl shadow-lg flex flex-col", className)}>
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
                onClick={async () => {
                  // Dynamically import html2pdf
                  const html2pdf = (await import('html2pdf.js')).default;
                  // Target the content inside the iframe
                  const iframeContent = previewRef.current?.contentWindow?.document.body;
                  if (iframeContent && typeof window !== 'undefined') { // Ensure window is defined
                    html2pdf().from(iframeContent).set({
                      margin: 1,
                      filename: 'preview.pdf',
                      html2canvas: { scale: 2, useCORS: true, scrollY: -window.scrollY }, // Now safe to use window
                      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
                    }).save();
                  } else {
                    console.error("Could not get iframe content or window object for PDF generation.");
                    // Fallback or show error
                    alert("Error generating PDF: Could not access preview content or browser environment.");
                  }
                }}
                aria-label="Download preview as PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
              {/* Add Print Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  const iframeWindow = previewRef.current?.contentWindow;
                  if (iframeWindow) {
                    iframeWindow.focus(); // Focus might be needed for print in some browsers
                    iframeWindow.print();
                  } else {
                    console.error("Could not get iframe content window for printing.");
                    // Consider showing a user-friendly message here
                    alert("Error printing: Could not access preview content.");
                  }
                }}
                aria-label="Print preview"
              >
                <Printer className="h-4 w-4" />
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
        {/* Make CardContent grow to fill space */}
        <CardContent className="p-0 flex-1">
          {/* Use iframe with srcDoc to isolate content */}
          <iframe
            ref={previewRef}
            srcDoc={html}
            className="preview-iframe w-full h-full border-0 bg-white" // Changed to h-full
            title="HTML Preview"
            sandbox="allow-scripts allow-same-origin allow-modals" // Allow modals for printing
          />
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
            {/* Also use iframe in fullscreen dialog */}
            <iframe
              srcDoc={html}
              className="w-full h-full border-0 bg-white flex-1"
              title="HTML Fullscreen Preview"
              sandbox="allow-scripts allow-same-origin allow-modals" // Allow modals for printing
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
