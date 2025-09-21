"use client"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"

import {
  MapPinIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"
import { LuClockAlert } from "react-icons/lu";
import { IoArrowForward } from "react-icons/io5";

interface ReagentCardProps {
  name: string
  description: string
  tags: string[]
  location: string
  expiryDate: string
  imageUrl: string
  // quantity: string
  formula?: string
}

const BG_LAYERS = [
  { backgroundColor: "rgba(204, 204, 204)" },
  { backgroundColor: "rgba(0, 0, 0, 0.9)" },
  { backgroundColor: "rgba(255, 255, 255, 0.06)" },
  {
    background:
      "radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, transparent 90%)",
  },
]

const ReagentCard = ({
  name,
  // description,
  tags,
  location,
  expiryDate,
  imageUrl,
  // quantity,
  formula,
}: ReagentCardProps) => {
  return (
    <div
      className="
            relative
            p-2
           md:w-[19rem] md:h-[18.5rem] 
           w-full
           border-white/30 border-solid border-[1.5px] rounded-xl
       "
    >
      {BG_LAYERS.map((style, index) => (
        <div
          key={index}
          className="absolute inset-0 rounded-xl"
          style={style}
        />
      ))}
      <div className="flex flex-row py-auto gap-4 md:gap-0 md:flex-col m-2 md:m-3 rounded-lg overflow-hidden drop-shadow-xl">
        <div className="relative w-[7rem] min-h-[6.5rem] flex items-center justify-center md:w-full md:h-[8rem]">
            <Image
                src={imageUrl || "./placeholder.webp"}
                fill
                className="object-cover rounded-lg h-full"
                alt=""
            />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="hidden md:block flex flex-wrap gap-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-black/30 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-1 md:py-4">
          <div className="
            flex flex-col justify-between
            ">
                <div className="
                    md:flex md:gap-1
                ">
                    <p className="text-white/60 text-sm md:text-sm italic mt-1 flex gap-1">
                        {/* Icon */}
                        {formula === "trade" ? (
                        <ArrowsRightLeftIcon className="w-5 h-5 text-orange-200" />
                        ) : formula === "sell" ? (
                        <CurrencyDollarIcon className="w-5 h-5 text-green-400" />
                        ) : formula === "giveaway" ? (
                        <GiftIcon className="w-5 h-5 text-blue-300" />
                        ) : (
                        <GiftIcon className="w-5 h-5 text-blue-300" />
                        )}
                        {/* Text */}
                        {formula === "trade" ? (
                        <span className="text-orange-200 md:hidden">Trade</span>
                        ) : formula === "sell" ? (
                        <span className="text-green-400 md:hidden">Sell</span>
                        ) : formula === "giveaway" ? (
                        <span className="text-blue-300 md:hidden">Giveaway</span>
                        ) : (
                        <span className="text-blue-300 md:hidden">Giveaway</span>
                        )}
                    </p>
                    <span className="flex items-center gap-3 md:gap-4">
                    <h4 className="text-white text-base md:text-xl">{name}</h4>
                    </span>
                </div>
            
            <p className="text-light-gray flex text-xs gap-0.5 mt-[0.1rem] md:hidden">
                <MapPinIcon className="w-5 h-5" />
                {location}
            </p>
            <div className="hidden gap-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="hidden md:flex flex-row gap-0.5 text-warning text-base">
              <LuClockAlert className="w-4.5 h-4.5 mt-0.75 text-warning" />
              {expiryDate}
            </p>
          </div>

          <div className="hidden md:block bg-light-gray h-[1px] my-2"></div>
          <p className="text-light-gray text-xs gap-0.5 mt-[0.1rem] hidden md:flex">
                <MapPinIcon className="w-5 h-5" />
                {location}
            </p>

          <div className="flex items-center justify-between">
            

            <div className="flex w-full justify-between">
                <p className="md:hidden flex text-warning text-sm md:text-base">
                <LuClockAlert className="w-4.5 h-4.5 mx-[0.1rem] md:mt-0.5 text-warning" />
                {expiryDate}
              </p>
              <div className="md:hidden">
                <Button
                  label="View"
                  textSize="text-xs"
                  icon={IoArrowForward}
                  iconPosition="right"
                  fontWeight="semibold"
                  className="px-[0.5rem] py-[0.3rem]"
                />
              </div>
              <div className="hidden md:block">
                <Button
                  label="View"
                  textSize="text-sm"
                  icon={IoArrowForward}
                  iconPosition="right"
                  fontWeight="semibold"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReagentCard
