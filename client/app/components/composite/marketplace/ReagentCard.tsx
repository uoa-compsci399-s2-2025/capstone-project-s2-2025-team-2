import { FaRegClock } from "react-icons/fa"
import { CiLocationOn } from "react-icons/ci"
import client from "@/app/services/fetch-client"
import { IoChatbubbleOutline } from "react-icons/io5"
import { MdOutlineRemoveRedEye } from "react-icons/md"

interface ReagentCardProps {
  name: string
  tradingType: "Sell" | "Trade" | "Giveaway"
  location: string
  listedDate: string
  expiryDate: string
  imageUrl?: string
  condition: string
  quantity: number
  purity: number
}

const ReagentCard = ({
  name,
  tradingType,
  location,
  listedDate,
  expiryDate,
  imageUrl,
  condition,
  quantity,
  purity,
}: ReagentCardProps) => {
  return (
    <div
      className="
           md:w-[13rem] md:h-[17rem] p-[0.2rem]
           h-[7.5rem] mx-[2rem] mb-[1.5rem] bg-transparent
           w-full font-sans
           border-blue-secondary dark:border-purple border-solid border-[1.5px] rounded-[15px]
       "
    >
      <div
        className="
               h-full flex
               border-dark-gray dark:border-gray-200 border-solid border-[1.5px] rounded-[12px]
           "
      >
        <div
          className="
                   bg-amber-400 w-[6.5rem] h-full
                   rounded-tl-[10px] rounded-bl-[10px]
                   md:hidden
               "
        >
          {imageUrl}
        </div>
        <div className="ml-[1rem] md:ml-[0.5rem]">
          <div className="flex mt-[0.2rem] md:mt-[0.5rem] justify-between">
            <div className="flex">
              <h6 className="text-secondary text-[12px]">{tradingType}</h6>
              <IoChatbubbleOutline className="hidden md:block ml-[0.4rem] dark:text-secondary" />
            </div>
            <div
              className="
                           hidden md:flex bg-dark-gray dark:bg-gray-200 mt-[-0.5rem] mr-[-0.6rem]
                           w-[1.7rem] items-center justify-center rounded-bl-[14px] rounded-tr-[10px]
                       "
            >
              <MdOutlineRemoveRedEye
                size={20}
                className="text-white dark:text-purple"
              />
            </div>
          </div>

          <h2 className="text-black dark:text-white text-[1.5rem] font-medium dark:font-light md:tracking-wide md:mt-[0.4rem]">
            {name}
          </h2>
          <div className="hidden md:w-[11.2rem] md:flex md:flex-col">
            <div className="md:flex md:justify-between w-[8.5rem] md:mt-[0.4rem]">
              <div className="">
                <p className="text-blue-100 dark:text-blue-200 font-light text-[0.8rem]">
                  Listed on
                </p>
                <p className="text-red-200 font-light text-[0.8rem]">Expires</p>
                <p className="text-green-100 dark:text-purple-100 font-light text-[0.8rem]">
                  Condition
                </p>
              </div>
              <div>
                <p className="text-dark-gray dark:text-gray-200 font-light text-[0.8rem]">
                  {listedDate}
                </p>
                <p className="text-dark-gray dark:text-gray-200 font-light text-[0.8rem]">
                  {expiryDate}
                </p>
                <p className="text-dark-gray dark:text-gray-200 font-light text-[0.8rem]">
                  {condition}
                </p>
              </div>
            </div>
            <div className="flex justify-between mt-[1rem]">
              <div>
                <p className="text-dark-gray font-extralight italic text-[0.7rem] dark:text-secondary">
                  Quantity
                </p>
                <h2 className="text-dark-gray font-extralight italic text-[1.7rem] dark:text-gray-200">
                  {quantity}
                </h2>
              </div>
              <div className="text-right">
                <p className="text-dark-gray font-extralight italic text-[0.7rem] dark:text-secondary">
                  Purity
                </p>
                <h2 className="text-dark-gray font-extralight italic text-[1.7rem] dark:text-gray-200">
                  {purity}%
                </h2>
              </div>
            </div>
          </div>
          <div className="flex items-center text-gray-100 md:hidden">
            <FaRegClock className="w-5 h-6 mr-[5px] dark:text-red-100" />{" "}
            <span>{expiryDate}</span>
          </div>
          <div className="flex text-gray-100 md:text-[0.7rem] items-center md:mt-[1.5rem] dark:text-gray-200">
            <CiLocationOn className="w-6 h-6 stroke-[1px] -ml-[2px] dark:stroke-lightblue md:stroke-gray-100 md:dark:stroke-gray-200" />{" "}
            <span className="ml-[0.2rem]">{location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReagentCard
