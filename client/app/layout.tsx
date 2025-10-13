import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "./providers"
import { Toaster } from "@/app/components/generic/sonner/Toaster"

export const metadata: Metadata = {
  title: "CoLab",
  description: "#OpenToWork",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
