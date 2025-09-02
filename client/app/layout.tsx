import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "./components/composite/sidebar/SideBar"
import TopBar from "./components/composite/topbar/TopBar"

export const metadata: Metadata = {
  title: "Chemical.ly",
  description: "#OpenToWork",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <TopBar />
        <Sidebar />

        <main className="ml-48 mt-12 h-[calc(100vh-3rem)] overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
