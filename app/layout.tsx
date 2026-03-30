import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"
import { TransitionProvider } from "@/context/transition-provider"
import { GlobalHexOverlay } from "@/components/global-hex-overlay"
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Nomade Home",
  description: "A home for nomads",
  icons: {
    icon: "/alienBABAB.webp",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable)}
    >
      <body>
          <TransitionProvider>
            <GlobalHexOverlay />
            {children}
          </TransitionProvider>
      </body>
    </html>
  )
}
