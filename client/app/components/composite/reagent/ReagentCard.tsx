"use client"
import {
  MapPinIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import { ArrowRightIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import { useRouter } from "next/navigation"

type TradingType = "giveaway" | "sell" | "trade"

interface ReagentCardProps {
  name: string
  tags: string[]
  location: string
  expiryDate: string
  imageUrl: string
  type: TradingType
  id: string
}

//trading type display style mapping
const TRADING_TYPE_STYLES: Record<
  TradingType,
  {
    color: string
    icon: React.ComponentType<{ className?: string }> | null
  }
> = {
  giveaway: { color: "text-blue-100", icon: GiftIcon },
  sell: { color: "text-green-100", icon: CurrencyDollarIcon },
  trade: { color: "text-purple-100", icon: ArrowsRightLeftIcon },
}

//temp hardcoded since it be bugging out when made into style vars
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
  tags,
  location,
  expiryDate,
  imageUrl,
  type,
  id,
}: ReagentCardProps) => {
  const router = useRouter()

  //single reagent view page
  const handleViewClick = () => {
    router.push(`/marketplace/${id}`)
  }

  return (
    <div className="md:w-[18.5rem] md:h-[20.5rem] min-w-[22rem] mx-auto w-full border border-white/10 border-solid rounded-xl relative ">
      {BG_LAYERS.map((style, index) => (
        <div
          key={index}
          className="absolute inset-0 rounded-xl"
          style={style}
        />
      ))}

      <div className="relative z-10 p-4">
        <div className="flex flex-row gap-3 md:gap-0 md:flex-col">
          {/*image + tags*/}
          <div className="relative w-[7.5rem] h-[full] md:w-full md:h-[9.5rem]">
            <Image
              src={(imageUrl as string) || "/placeholder.webp"}
              fill
              className="object-cover rounded-lg"
              alt=""
            />
            <div className="absolute rounded-b-lg bottom-0 left-0 right-0 p-2">
              <div className="hidden md:flex flex-wrap gap-1">
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

          {/*reagent details*/}
          <div className="flex flex-col justify-between flex-1 gap-2 md:gap-2 md:pt-3 min-h-0 overflow-hidden">
            <div className="flex flex-col justify-between gap-2 overflow-hidden">
              <div className="">
                {(() => {
                  const typeStyle = TRADING_TYPE_STYLES[
                    type?.toLowerCase() as TradingType
                  ] || { color: "", icon: null }
                  const IconComponent = typeStyle.icon
                  return (
                    <div className="flex-col flex md:hidden">
                      <p
                        className={`flex items-center gap-1 text-sm md:text-base ${typeStyle.color}`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </p>
                    </div>
                  )
                })()}
              </div>
              <h4 className="text-white text-base md:text-lg tracking-wider leading-tight font-normal truncate max-w-9/10 text-[1.3rem] mb-[5px] md:mb-0">
                {name}
              </h4>
              <p className="mt-[-3px] underline-offset-2 text-white/50 flex text-xs gap-0.5 md:hidden">
                <MapPinIcon className="w-5 h-5" />
                <span className="truncate max-w-[135px]">{location}</span>
              </p>

              <div className="flex items-center justify-between">
                {/*icon + colour dependent on type*/}
                {(() => {
                  const typeStyle = TRADING_TYPE_STYLES[
                    type?.toLowerCase() as TradingType
                  ] || { color: "", icon: null }
                  const IconComponent = typeStyle.icon
                  return (
                    <div className="hidden md:flex-col md:flex">
                      <span className="text-white/50 text-xs">Type</span>
                      <p
                        className={`flex items-center gap-1 text-sm md:text-base ${typeStyle.color}`}
                      >
                        {IconComponent && <IconComponent className="w-5 h-5" />}
                        {type.charAt(0).toUpperCase() +
                          type.slice(1).toLowerCase()}
                      </p>
                    </div>
                  )
                })()}

                {/*expiry*/}
                <div className="flex flex-col items-end w-full">
                  <span className="text-white/50 text-xs hidden md:block">
                    Expires
                  </span>
                  <div className="flex justify-between w-full md:hidden">
                    <p className="flex items-center justify-center gap-0.5 text-warning text-sm md:text-base ">
                      <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                      {expiryDate}
                    </p>
                    <button
                      onClick={handleViewClick}
                      className="flex items-center gap-0.5 px-2 py-1.5 text-sm font-medium text-white bg-blue-primary hover:bg-blue-secondary rounded-lg"
                    >
                      View
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="hidden md:flex items-center justify-center gap-0.5 text-warning text-sm md:text-base">
                    <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-warning" />
                    {expiryDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden md:block bg-light-gray/30 h-[0.5px] my-1" />

            {/*location + reagent view button*/}
            <div className="hidden md:flex items-center justify-between">
              <div className="hidden md:flex flex-col">
                <p className="underline-offset-2 text-white/50 flex text-xs gap-0.5">
                  <MapPinIcon className="w-5 h-5" />
                  <span className="truncate max-w-[135px]">{location}</span>
                </p>
              </div>

              <button
                onClick={handleViewClick}
                className="flex items-center gap-0.5 px-2 py-1.5 text-sm font-medium text-white bg-blue-primary hover:bg-blue-secondary rounded-lg"
              >
                View
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReagentCard
