import Landing from "./components/composite/landing/Landing"

export default function Home() {
  return (
    <div
      className="
    bg-tint pb-[2rem] dark:bg-black min-h-[100vh]

  "
      style={{
        backgroundImage: 'url("/CoLabLanding2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <Landing />
    </div>
  )
}
