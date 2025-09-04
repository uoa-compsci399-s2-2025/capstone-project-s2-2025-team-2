import { FaRegClock } from "react-icons/fa"
import { CiLocationOn } from "react-icons/ci"
import client from "@/app/services/fetch-client"
import { IoChatbubbleOutline } from "react-icons/io5"
import { MdOutlineRemoveRedEye } from "react-icons/md"
import Image from "next/image"

interface ReagentCardProps {
  name: string
  description: string
  tradingType: "Sell" | "Trade" | "Giveaway"
  location: string
  expiryDate: string
  imageUrl?: string
  quantity: number
  purity: number
}

const ReagentCard = ({
  name,
  description,
  tradingType,
  location,
  expiryDate,
  imageUrl,
  quantity,
  purity,
}: ReagentCardProps) => {
  return (
    <div
      className="
           md:w-[20rem] md:h-[24rem] 
           w-[15rem] h-[7.5rem] bg-transparent
           border-white border-solid border-[1.5px] rounded-xl
           bg-gradient-to-b from-primary via-10% to-gray opacity-75
       "
    >
      <p className="underline-offset-2 underline m-4 text-xs flex gap-1">
        <CiLocationOn className="w-4 h-4" />
        {location}
      </p>
      <div className="m-4 border border-white rounded-lg">//image here</div>
    </div>
  )
}

export default ReagentCard
