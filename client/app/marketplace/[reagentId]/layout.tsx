import Overlay from "@/app/components/composite/Overlay"

export default function ReagentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Overlay>{children}</Overlay>
}
