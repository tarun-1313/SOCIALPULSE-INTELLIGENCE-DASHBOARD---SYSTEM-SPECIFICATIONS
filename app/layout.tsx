import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SocialPulse | Professional Social Analytics",
  description: "Monitor, analyze, and manage your social media presence with real-time insights.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.className} antialiased bg-background text-foreground selection:bg-primary/30`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 w-full h-screen overflow-y-auto overflow-x-hidden">
            <div className="max-w-[1200px] mx-auto min-h-full">{children}</div>
          </main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
