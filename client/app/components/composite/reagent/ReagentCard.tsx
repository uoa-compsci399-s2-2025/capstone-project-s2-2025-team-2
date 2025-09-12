"use client"
import { MapPinIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline"

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
           md:w-[20rem] md:h-[22rem] 
           w-[15rem] h-[25rem]
           border-white/30 border-solid border-[1.5px] rounded-xl
           bg-primary/80
       "
    >
      <div className="m-4 border border-white/30 rounded-lg overflow-hidden relative h-32 drop-shadow-xl">
        {imageUrl ? (
          <Image src={imageUrl} fill className="object-cover" alt="" />
        ) : null}
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <div className="flex flex-wrap gap-1">
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
      <span className="flex mx-4 items-center gap-8">
        {" "}
        <h3 className="text-white italic">{name}</h3>
        <p className="text-white/60 italic mt-1">[{formula}]</p>
      </span>
      <p className="text-light-gray mx-4">{description}</p>
      <span className="flex flex-col gap-.5 mx-4 mt-1">
        <p className="text-gray">Expires</p>
        <h5 className="text-warning font-bold">{expiryDate}</h5>
      </span>
      <div className="bg-light-gray h-[1px] mx-6 my-2"></div>{" "}
      <div className="items-center flex justify-between md:m-4 m-6">
        {" "}
        <p className="underline-offset-2 text-light-gray underline flex text-xs gap-1">
          <MapPinIcon className="md:w-4 md:h-4 w-3 h-3" />
          {location}
        </p>
        <div className="md:w-[8rem] ml-auto md:translate-x-2">
          <Button
            label="Request"
            size="small"
            icon={ChevronDoubleRightIcon}
            iconPosition="right"
          />
        </div>
      </div>
    </div>
  )
}

export default ReagentCard
