import type { Metadata } from "next"
import "./globals.css"
import { Providers } from './providers'

export const metadata: Metadata = {
  title: "Chemical.ly",
  description: "#OpenToWork",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>        <Providers>
          {children}
        </Providers></body>
    </html>
  )
}
