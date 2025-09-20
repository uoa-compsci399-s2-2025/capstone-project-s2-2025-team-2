"use client"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"

import {
  MapPinIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  ChevronDoubleRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"

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
           md:w-[19rem] md:h-[18.5rem] 
           w-full
           border-white/30 border-solid border-[1.5px] rounded-xl
           bg-primary/80
       "
    >
      <div className="flex flex-row gap-4 md:gap-0 md:flex-col m-2 md:m-3 rounded-lg overflow-hidden drop-shadow-xl">
        <div className="relative w-[7rem] h-[6.5rem] md:w-full md:h-[8rem]">
          <Image
            src={imageUrl || "./placeholder.webp"}
            fill
            className="object-cover rounded-lg"
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
          <div className="flex flex-col justify-between">
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
                  <span className="text-orange-200">Trade</span>
                ) : formula === "sell" ? (
                  <span className="text-green-400">Sell</span>
                ) : formula === "giveaway" ? (
                  <span className="text-blue-300">Giveaway</span>
                ) : (
                  <span className="text-blue-300">Giveaway</span>
                )}
              </p>
            <span className="flex items-center gap-3 md:gap-4">
              <h4 className="text-white text-base md:text-xl italic">{name}</h4>
            </span>
            <p className="text-light-gray flex text-xs gap-0.5 mt-[0.1rem] mb-[-1.5rem]">
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
              <ClockIcon className="w-4.5 h-4.5 mt-0.75 text-warning" />
              {expiryDate}
            </p>
          </div>

          <div className="hidden md:block bg-light-gray h-[1px] my-2"></div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <p className="md:hidden flex text-warning text-sm md:text-base">
                <ClockIcon className="w-5 h-5 md:mt-0.5 text-warning" />
                {expiryDate}
              </p>
              
            </div>

            <div className="">
              <div className="md:hidden">
                <Button
                  label="View"
                  textSize="text-xs"
                  icon={ChevronDoubleRightIcon}
                  iconPosition="right"
                  fontWeight="semibold"
                />
              </div>
              <div className="hidden md:block">
                <Button
                  label="View"
                  textSize="text-sm"
                  icon={ChevronDoubleRightIcon}
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
