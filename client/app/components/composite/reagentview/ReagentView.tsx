import { FaRegClock } from "react-icons/fa"
import { LuClockAlert } from "react-icons/lu"
import { LuHouse } from "react-icons/lu"
import SellerContact from "./SellerContact"
import ReagentBreadcrumb from "./ReagentBreadcrumb"
import Image from "next/image"

interface ReagentView {
    name?: string
    listedDate?: string
    expiryDate?: string
    location?: string
    price?: number
    category?: string
    condition?: string
    quantity?: string
    description?: string
    tags?: string[]
    image: string
}

const ReagentView = ({ 
  name, 
  listedDate, 
  expiryDate, 
  location, 
  price, 
  category, 
  condition, 
  quantity, 
  description, 
  tags,
  image 
}: ReagentView) => {
  return (
    <div className="
        bg-white h-full font-family-sans p-[2rem]
        dark:bg-black
    ">
      <ReagentBreadcrumb />
      <div className="flex flex-col items-center">
        <h1 className="text-black dark:text-white tracking-wider">{name}</h1>
        <div className="flex justify-around w-[43rem] mx-auto mt-[1rem]">
          <h5 className="flex text-green-200 items-center text-[0.8rem]">
            <FaRegClock className="text-green-200 mr-[0.3rem] w-5 h-5" /> Listed
            - {listedDate}
          </h5>
          <h5 className="flex text-red-300 items-center text-[0.8rem]">
            <LuClockAlert className="text-red-300 mr-[0.3rem] w-5 h-5" />
            Expires - {expiryDate}
          </h5>
          <h5 className="flex text-blue-300 items-center text-[0.8rem]">
            <LuHouse className="text-blue-300 mr-[0.3rem] w-5 h-5" /> Location -
            {location}
          </h5>
        </div>
      </div>
      <div className="flex mt-[2rem]">
        <div className="flex-[1] relative">
            <Image src={image ?? "/placeholder.webp"} alt="Reagent"
                fill
                className="object-cover"/>
        </div>
        <div className="flex-[1.5] ml-[2rem]">
          <div className="bg-green-300 dark:bg-green-600/40 rounded-[10px] shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
            <div className="text-center py-[1rem]">
              <h4 className="text-green-400 dark:text-green-500 font-bold">Current price</h4>
              <h2 className="text-green-400 dark:text-green-500">${price}</h2>
            </div>
            <div className="flex bg-gray-300 dark:bg-primary p-[2rem] rounded-b-[10px]">
              <div className="flex-[0.25]">
                <p className="text-dark-gray font-bold mb-[0.7rem] dark:text-white">
                  Category - {category}
                </p>
                <p className="text-dark-gray font-bold mb-[0.7rem] dark:text-white">
                  Condition - {condition}
                </p>
                <p className="text-dark-gray font-bold dark:text-white">Quantity - {quantity}</p>
              </div>
              <div className="flex-[0.75] ml-[1rem]">
                <p className="text-dark-gray dark:text-white">
                  {description}
                </p>
                <div className="mt-[3rem] flex">
                    {tags?.map((tag)=> {
                        return (
                            <div className="mx-[0.4rem] bg-light-gray text-dark-gray px-[0.8rem] rounded-[0.7rem] font-family-sans tracking-widest dark:text-white dark:bg-secondary">
                                {tag}
                            </div>
                        )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[60vw] mx-auto my-[2rem] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
      <div className="flex flex-col items-center gap-5">
        <h3 className="text-[1.1rem] font-bold text-black dark:text-white">Reagent Owner</h3>
        <SellerContact />
      </div>
    </div>
  )
}

export default ReagentView
