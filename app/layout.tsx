import type { Metadata } from 'next';
import { Suspense } from 'react'; // Import Suspense
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from '@/components/navbar'; // Import the Navbar
import './globals.css'

export const metadata: Metadata = {
  title: 'Gennnotes',
  description: 'Ai powered notes generator that generates detailed researched notes with image and daigrams in one click',
  keywords: ['ai notes', 'note generator', 'research notes', 'diagrams', 'images', 'automated notes'],
  icons: {
    icon: '/logo.png' // Link to your favicon in the public folder
  },
  openGraph: {
    title: 'Gennnotes',
    description: 'Ai powered notes generator that generates detailed researched notes with image and daigrams in one click',
    url: '/', // Replace with your actual site URL if deployed
    siteName: 'Gennnotes',
    images: [
      {
        url: '/og.png', // Link to your OG image in the public folder
        width: 1200, // Specify width
        height: 630, // Specify height
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: { // Optional: Add Twitter card metadata
    card: 'summary_large_image',
    title: 'Gennnotes',
    description: 'Ai powered notes generator that generates detailed researched notes with image and daigrams in one click',
    images: ['/og.png'], // Link to your OG image
  },
  // generator: 'v0.dev', // You can keep or remove this
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full"> {/* Add h-full */}
      <body className="h-full flex flex-col"><StackProvider app={stackServerApp}><StackTheme> {/* Add h-full and flex layout */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false} // Force dark theme regardless of system preference
          disableTransitionOnChange
        >
          {/* Wrap Navbar in Suspense to handle potential suspension from useUser */}
          <Suspense fallback={<div className="h-[68px]"></div>}> {/* Basic fallback with approx height */}
            <Navbar />
          </Suspense>
          {/* Make children container grow */}
          <div className="flex-1 overflow-auto">
             {children}
          </div>
        </ThemeProvider>
      </StackTheme></StackProvider></body>
    </html>
  )
}
