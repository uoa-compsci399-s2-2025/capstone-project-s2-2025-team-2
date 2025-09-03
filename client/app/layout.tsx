//"use client";

import type { Metadata } from "next"
import "./globals.css"
//import { usePathname } from 'next/navigation';
import Sidebar from "./components/composite/sidebar/SideBar"
import TopBar from "./components/composite/topbar/TopBar"

export const metadata: Metadata = {
  title: "Chemical.ly",
  description: "#OpenToWork",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //const pathname = usePathname();
  //const isLandingPage = pathname === '/';
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <TopBar />
        <Sidebar />

        <main className="pl-48 pt-12 h-[calc(100vh)] overflow-auto">
          {children}
        </main>
      </body>
    </html>
  )
}
