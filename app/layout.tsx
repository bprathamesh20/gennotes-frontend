import type { Metadata } from 'next'
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from '@/components/navbar'; // Import the Navbar
import './globals.css'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false} // Force dark theme regardless of system preference
          disableTransitionOnChange
        >
          <Navbar /> {/* Add the Navbar here */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
