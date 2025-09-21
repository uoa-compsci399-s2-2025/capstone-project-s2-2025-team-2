import Sidebar from "@/app/components/composite/sidebar/SideBar"

export default function Overlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-60 pt-14 lg:pt-5 min-h-[calc(100vh)]">
        {children}
      </main>
    </div>
  )
}
