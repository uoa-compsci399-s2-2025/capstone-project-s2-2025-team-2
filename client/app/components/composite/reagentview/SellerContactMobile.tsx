import { LuHouse } from "react-icons/lu"
import { FaRegStar } from "react-icons/fa"
import Image from "next/image"
import { useState, useEffect } from "react"
import client from "../../../services/fetch-client"
import type { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface SellerContactMobileProps {
  rating?: number
  reagent?: ReagentWithId
}

const SellerContactMobile = ({ rating, reagent }: SellerContactMobileProps) => {
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
  return (
    <div className="flex flex-row gap-[2rem] items-center">
      <div className="block relative bg-yellow-600 rounded-full border-2 border-white h-[4rem] w-[4rem] overflow-hidden">
        <Image
          src="/placeholder.webp"
          alt="Reagent"
          fill
          className="object-cover"
        />
      </div>

      <div className="mx-[1.5rem]">
        <h4 className="text-[1rem] font-bold text-white">
          {sellerInfo?.preferredName || "Unknown Seller"}
        </h4>
        <span className="flex items-center text-[0.8rem] font-bold text-white">
          <LuHouse className="mr-[0.3rem]" />
          {reagent?.location || "Location not specified"}
        </span>
        <span className="text-gold items-center flex text-[0.8rem] font-bold">
          <FaRegStar className="mr-[0.3rem]" />
          {rating !== undefined
            ? `${rating} (${rating}% Positive Feedback)`
            : "No rating yet"}
        </span>
      </div>
    </div>
  )
}

export default SellerContactMobile
