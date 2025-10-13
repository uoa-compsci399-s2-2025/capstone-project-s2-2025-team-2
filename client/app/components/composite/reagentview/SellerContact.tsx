import { LuHouse } from "react-icons/lu"
import { FaRegStar } from "react-icons/fa"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"
import { useState, useEffect } from "react"
import ReagentRequest from "../reagent/ReagentRequest"
import client from "../../../services/fetch-client"
import type { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface SellerContactProps {
  rating?: number
  reagent?: ReagentWithId
}

const SellerContact = ({ rating, reagent }: SellerContactProps) => {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [sellerInfo, setSellerInfo] = useState<any>(null)

  //fetch seller info using user id
  useEffect(() => {
    if (!reagent?.user_id) return

    const fetchSellerInfo = async () => {
      try {
        const { data } = await client.GET(
          `/users/${reagent.user_id}` as any,
          {},
        )
        if (data) {
          setSellerInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch seller information:", error)
      }
    }

    fetchSellerInfo()
  }, [reagent?.user_id])

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
        <div className="hidden md:block relative rounded-full border-2 border-white h-[4rem] w-[4rem] overflow-hidden">
          <img
            src={sellerInfo?.image || "/default_pfp.jpg"}
            alt="User Profile Photo"
            className="w-full h-full object-cover"
            style={{ imageRendering: 'auto' }}
            onError={(e) => {
              e.currentTarget.src = "/default_pfp.jpg"
            }}
          />
        </div>

        <div className="hidden md:block  mx-[1.5rem]">
          <h4 className="text-[1rem] text-white">
            {sellerInfo?.displayName || "Unknown Seller"}
          </h4>
          <span className="flex items-center text-[0.8rem] font-bold text-white">
            <LuHouse className="mr-[0.3rem]" />
            {reagent?.location || "Location not specified"}
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
