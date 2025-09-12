"use client"
import { MapPinIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"
import { ChevronDoubleRightIcon, ClockIcon } from "@heroicons/react/24/outline"

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
  description,
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
           w-full h-[8rem]
           border-white/30 border-solid border-[1.5px] rounded-xl
           bg-primary/80
       "
    >
      <div className="flex flex-row md:flex-col m-2 md:m-4 rounded-lg overflow-hidden drop-shadow-xl">
        <div className="relative w-[7rem] h-[6.5rem] md:w-[18rem] md:h-[8rem]">
          {imageUrl ? (
            <Image src={imageUrl} fill className="object-cover" alt="" />
          ) : null}
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

        <div className="flex flex-col justify-between flex-1 px-4 py-2">
          <span className="flex items-center gap-2 md:gap-4">
            <h4 className="text-white text-lg md:text-xl italic">{name}</h4>
            <p className="text-white/60 text-sm md:text-sm italic mt-1">
              [{formula}]
            </p>
          </span>

          <div className="flex flex-col mt-1">
            <p className="flex text-warning text-sm md:text-base">
              <ClockIcon className="w-5 h-5 md:mt-0.5 text-warning" />
              {expiryDate}
            </p>

            <div className="hidden md:block bg-light-gray h-[1px] my-2"></div>

            <div className="flex items-center justify-between">
              <p className="underline-offset-2 text-light-gray underline flex text-xs gap-0.5">
                <MapPinIcon className="w-4 h-4 mt-0.5" />
                {location}
              </p>
              <div className="ml-auto w-[6rem] d:translate-x-2">
                <Button
                  label="View"
                  size="small"
                  icon={ChevronDoubleRightIcon}
                  iconPosition="right"
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
