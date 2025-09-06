import Sidebar from "@/app/components/composite/sidebar/SideBar"
import TopBar from "@/app/components/composite/topbar/TopBar"

export default function Overlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <body>
      <TopBar />
      <Sidebar />
      <main className="ml-60 pt-14 h-[calc(100vh)] overflow-auto">
        {children}
      </main>
    </body>
  )
}
