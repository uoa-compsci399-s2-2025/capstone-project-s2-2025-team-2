import { FaRegClock } from "react-icons/fa"
import { CiLocationOn } from "react-icons/ci"
import client from "@/app/services/fetch-client"

interface ReagentCardProps {
  name: string
  tradingType: "sell" | "trade" | "giveaway"
  location: string
  expiryDate: string
  imageUrl?: string
}

const ReagentCard = ({
  name,
  tradingType,
  location,
  expiryDate,
  imageUrl,
}: ReagentCardProps) => {
  return (
    <div
      className="
            w-full md:h-[17rem] p-[0.2rem] 
            h-[6.5rem] mx-[2rem] mb-[1.5rem]
            
            border-blue-secondary border-solid border rounded-md
        "
    >
      <div
        className="
                h-full flex md:flex-col
                border-dark-gray border-solid border rounded-md
            "
      >
        <div
          className="
                    w-[6rem] h-full
                    rounded-tl-[10px] rounded-bl-[10px]
                "
        >
          {imageUrl}
        </div>
        <div className="md:ml-0 ml-auto p-2">
          <h6 className="text-secondary text-[12px]">{tradingType}</h6>
          <h6 className="text-black">{name}</h6>
          <div className="flex items-center">
            <FaRegClock className="w-5 h-6 mr-[5px]" />{" "}
            <span>{expiryDate}</span>
          </div>
          <div className="flex text-gray-100">
            <CiLocationOn className="w-6 h-6 stroke-[1px] -ml-[2px]" />{" "}
            <span>{location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReagentCard
