import Sidebar from "@/app/components/composite/sidebar/SideBar"

export default function Overlay({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-60 pt-[4rem] lg:pt-[2rem] min-h-screen">
        {children}
      </main>
    </div>
  )
}
