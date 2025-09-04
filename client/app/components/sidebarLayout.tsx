import Sidebar from "../components/composite/sidebar/SideBar";
import TopBar from "../components/composite/topbar/TopBar";

export default function WithLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <body>
      <TopBar />
      <Sidebar />
      <main className="pl-48 pt-12 h-[calc(100vh)] overflow-auto">
        {children}
      </main>
    </body>
  );
}
