import Chemical from "../public/chemical.svg"
import Button from "./components/generic/button/regular/Button"
import Image from "next/image"
const NotFound = () => (
  <div className="w-full h-[100vh] bg-primary flex flex-col justify-center items-center gap-2">
    <Image src={Chemical} alt="Chemical" className="m-4 w-24 h-24 rotate-180" />
    <h1 className="text-white">404</h1>
    <h2 className="text-white/70">Page Not Found</h2>
    <p>Sorry, we couldn't find the page you're looking for.</p>
    <a href="/marketplace" className="mt-4">
      <Button
        label="Go back to marketplace"
        className="hover:bg-blue-primary/75 duration-300 m-2 p-2"
        textSize="text-sm"
        fontWeight="semibold"
      />
    </a>
  </div>
)

export default NotFound
