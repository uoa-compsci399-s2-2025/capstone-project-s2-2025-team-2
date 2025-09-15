"use client"
import { MapPinIcon } from "@heroicons/react/24/outline"
import Image from "next/image"
import Button from "../../generic/button/regular/Button"
import { ChevronDoubleRightIcon, ClockIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

interface ReagentCardProps {
  name: string
  description: string
  tags: string[]
  location: string
  expiryDate: string
  imageUrl: string
  // quantity: string
  formula?: string
  id: string
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
  id,
}: ReagentCardProps) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/marketplace/${id}`)
  }
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
          <Image src="/placeholder.webp" fill className="object-cover" alt="" />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="hidden md:block flex flex-wrap gap-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-background/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-1 md:py-4 min-h-0 overflow-hidden">
          <div className="flex flex-col justify-between overflow-hidden">
            <span className="flex items-start gap-3 md:gap-3 min-w-0">
              <h4 className="text-white text-sm md:text-lg italic line-clamp-2 flex-1 min-w-0 leading-tight">
                {name}
              </h4>
              <p className="text-white/60 text-xs md:text-sm italic mt-0.5 flex-shrink-0">
                [{formula}]
              </p>
            </span>

            <div className="md:hidden flex flex-wrap gap-1">
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
              <p className="underline-offset-2 text-light-gray underline flex text-xs gap-0.5">
                <MapPinIcon className="w-4 h-4 mt-0.5" />
                {location}
              </p>
            </div>

            <div className="">
              <div className="md:hidden">
                <Button
                  label="View"
                  size="small"
                  textSize="xsmall"
                  icon={ChevronDoubleRightIcon}
                  iconPosition="right"
                  fontWeight="semibold"
                />
              </div>
              <div className="hidden md:block">
                <Button
                  onClick={handleClick}
                  label="View"
                  size="small"
                  textSize="small"
                  icon={ChevronDoubleRightIcon}
                  iconPosition="right"
                  fontWeight="semibold"
                />
              </div>
              <span className="hidden">{imageUrl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReagentCard
