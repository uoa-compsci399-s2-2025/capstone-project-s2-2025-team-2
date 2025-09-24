import { LuHouse } from "react-icons/lu"
import { FaRegStar } from "react-icons/fa"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"
import { useState } from "react"
import ReagentRequest from "../reagent/ReagentRequest"
import type { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface SellerContactProps {
  name?: string
  location?: string
  rating?: number
  reagent?: ReagentWithId
}

const SellerContact = ({
  name,
  location,
  rating,
  reagent,
}: SellerContactProps) => {
  const [isRequestOpen, setIsRequestOpen] = useState(false)

  const handleRequestClick = () => {
    if (reagent) {
      setIsRequestOpen(true)
    }
  }

  const handleRequestClose = () => {
    setIsRequestOpen(false)
  }

  const handleRequestSubmit = () => {
    console.log("Request submitted successfully")
  }

  return (
    <div className="flex flex-row items-center md:mb-[2rem] gap-[4.5rem] md:gap-[8.5rem]">
      <div className="flex flex-row">
        <div className="hidden md:block relative bg-yellow-600 rounded-full border-2 border-white h-[4rem] w-[4rem] overflow-hidden">
          <Image
            src="/placeholder.webp"
            alt="Reagent"
            fill
            className="object-cover"
          />
        </div>

        <div className="hidden md:block  mx-[1.5rem]">
          <h4 className="text-[1rem] text-white">{name || "text"}</h4>
          <span className="flex items-center text-[0.8rem] font-bold text-white">
            <LuHouse className="mr-[0.3rem]" />
            {location || "text"}
          </span>
          <span className="text-white items-center flex text-[0.8rem] font-bold">
            <FaRegStar className="mr-[0.3rem]" />
            {rating !== undefined
              ? `${rating} (${rating}% Positive Feedback)`
              : "No rating yet"}
          </span>
        </div>
      </div>

      <Button
        label="Request Reagent"
        onClick={handleRequestClick}
        className="
          px-[1.5rem] py-[1.5rem] rounded-[18px] md:rounded-[8px] md:text-sm md:px-6 md:w-auto md:py-1.5 md:justify-center
          font-semibold 
          "
      />

      {reagent && (
        <ReagentRequest
          isOpen={isRequestOpen}
          onClose={handleRequestClose}
          onSubmit={handleRequestSubmit}
          reagent={reagent}
        />
      )}
    </div>
  )
}

export default SellerContact
