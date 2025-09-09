import Sidebar from "@/app/components/composite/sidebar/SideBar"

export default function Overlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-60 pt-14 md:pt-5 h-[calc(100vh)] overflow-auto">
        {children}
      </main>
    </div>
  )
}
