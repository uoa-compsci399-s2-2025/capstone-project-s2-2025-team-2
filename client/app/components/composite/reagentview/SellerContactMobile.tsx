import { LuHouse } from "react-icons/lu"
import { FaRegStar } from "react-icons/fa"
import Image from "next/image"

interface SellerContactMobileProps {
  name?: string
  location?: string
  rating?: number
}

const SellerContactMobile = ({
  name,
  location,
  rating,
}: SellerContactMobileProps) => {
  return (
    <div className="flex flex-row gap-[1rem] items-center">
      <div className="block relative bg-yellow-600 rounded-full border-2 border-white h-[4rem] w-[4rem] overflow-hidden">
        <Image
          src="/placeholder.webp"
          alt="Reagent"
          fill
          className="object-cover"
        />
      </div>

      <div className="mx-[1.5rem]">
        <h4 className="text-[1rem] font-boldtext-white">{name || "text"}</h4>
        <span className="flex items-center text-[0.8rem] font-bold text-white">
          <LuHouse className="mr-[0.3rem]" />
          {location || "text"}
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
