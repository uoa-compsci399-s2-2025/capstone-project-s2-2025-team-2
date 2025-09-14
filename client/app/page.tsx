import Header from "./components/composite/landing/Header"
import Landing from "./components/composite/landing/Landing"

export default function Home() {
  return (
    <div
      className="
    bg-tint pb-[2rem] dark:bg-black min-h-[100vh]
    md:p-[3rem]
  "
    >
      <Header />
      <Landing />
    </div>
  )
}
