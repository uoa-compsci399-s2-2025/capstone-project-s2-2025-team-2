import { LuHouse } from "react-icons/lu"
import { FaRegStar } from "react-icons/fa"

interface SellerContactProps {
  name?: string
  location?: string
  rating?: number
}

const SellerContact = ({ name, location, rating }: SellerContactProps) => {
  return (
    <div className="flex flex-row items-center">
      <div className="bg-yellow-600 rounded-[50%] border-2 border-black dark:border-white flex flex-col justify-center items-center h-[4rem] w-[4rem]">
        PFP
      </div>
      <div className="mx-[1.5rem]">
        <h4 className="text-midnight text-[1rem] font-bold dark:text-white">
          {name || "Violet Chen"}
        </h4>
        <span className="flex items-center text-[0.8rem] text-midnight font-bold dark:text-white">
          <LuHouse className="mr-[0.3rem]" />
          {location || "University of Auckland"}
        </span>
        <span className="text-gold items-center flex text-[0.8rem] font-bold">
          <FaRegStar className="mr-[0.3rem]" />
          {rating !== undefined ? `${rating} (${rating}% Positive Feedback)` : "No rating yet"}
        </span>
      </div>
      <button className="bg-blue-primary text-white font-sans rounded-[5px]">
        <h4 className="text-[0.8rem] font-semibold px-[2.5rem] py-[0.5rem]">
          Contact {name || "Violet"}
        </h4>
      </button>
    </div>
  )
}

export default SellerContact
