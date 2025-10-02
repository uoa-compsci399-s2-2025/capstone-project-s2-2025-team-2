"use client"

import {
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline"
import Image from "next/image"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

type TradingType = "giveaway" | "sell" | "trade"

interface BaseCardProps {
  name: string
  categories: string[]
  expiryDate: string
  images?: string[]
  tradingType: TradingType
  footerLeft: ReactNode
  reagentId: string
}

//trading type display style mapping
const TRADING_TYPE_STYLES = {
  giveaway: { color: "text-blue-100", icon: GiftIcon },
  sell: { color: "text-green-100", icon: CurrencyDollarIcon },
  trade: { color: "text-purple-100", icon: ArrowsRightLeftIcon },
} as const

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

const BaseCard = ({
  name,
  categories,
  expiryDate,
  images,
  tradingType,
  footerLeft,
  reagentId,
}: BaseCardProps) => {
  const router = useRouter()
  const { color, icon: Icon } = TRADING_TYPE_STYLES[tradingType] || {}
  const imageUrl =
    images?.[0]?.trim() &&
    (images[0].startsWith("/") ||
      images[0].startsWith("./") ||
      images[0].startsWith("http"))
      ? images[0]
      : "/placeholder.webp"

  //reusable components for both mobile and desktop view
  const tradingTypeLabel = tradingType[0].toUpperCase() + tradingType.slice(1)

  const ExpiryDisplay = () => (
    <p className="flex items-center justify-center gap-0.5 text-warning text-sm md:text-base">
      <ClockIcon className="w-5 h-5 md:w-6 md:h-6 text-warning" />
      {expiryDate}
    </p>
  )

  const ViewButton = () => (
    <button
      onClick={() => router.push(`/marketplace/${reagentId}`)}
      className="flex items-center gap-0.5 px-2 py-1.5 text-sm font-medium text-white bg-blue-primary hover:bg-blue-secondary rounded-lg"
    >
      View
      <ArrowRightIcon className="w-5 h-5" />
    </button>
  )

  const TradingTypeDisplay = ({ mobile = false }: { mobile?: boolean }) => (
    <div
      className={
        mobile ? "flex-col flex md:hidden" : "hidden md:flex-col md:flex"
      }
    >
      {!mobile && <span className="text-white/50 text-xs">Type</span>}
      <p className={`flex items-center gap-1 text-sm md:text-base ${color}`}>
        <Icon className="w-5 h-5" />
        {tradingTypeLabel}
      </p>
    </div>
  )
  return (
    <div className="md:min-w-0 md:w-[18.5rem] md:h-[20.5rem] min-w-[22rem] w-full border border-white/10 border-solid rounded-xl relative">
      {BG_LAYERS.map((style, i) => (
        <div key={i} className="absolute inset-0 rounded-xl" style={style} />
      ))}

      <div className="relative z-10 p-4">
        <div className="flex flex-row gap-3 md:gap-0 md:flex-col">
          {/*image + tags*/}
          <div className="relative w-[7.5rem] h-[full] md:w-full md:h-[9.5rem]">
            <Image
              src={imageUrl}
              fill
              className="object-cover rounded-lg"
              alt=""
            />
            <div className="absolute rounded-b-lg bottom-0 left-0 right-0 p-2">
              <div className="hidden md:flex flex-wrap gap-1">
                {categories.map((cat, i) => (
                  <span
                    key={i}
                    className="bg-background/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/*reagent details*/}
          <div className="flex flex-col justify-between flex-1 gap-2 md:gap-2 md:pt-3 min-h-0 overflow-hidden">
            <div className="flex flex-col justify-between gap-2 overflow-hidden">
              {/*mobile: trading type above name*/}
              <TradingTypeDisplay mobile />

              {/*reagent name*/}
              <h4 className="text-white text-base md:text-lg tracking-wider leading-tight font-normal truncate max-w-9/10 text-[1.3rem] mb-[5px] md:mb-0">
                {name}
              </h4>

              {/*mobile: location*/}
              <p className="mt-[-3px] underline-offset-2 text-white/50 flex text-xs gap-0.5 md:hidden">
                <span className="truncate max-w-[135px]">{footerLeft}</span>
              </p>

              {/*desktop: trading type*/}
              <div className="flex items-center justify-between">
                <TradingTypeDisplay />

                {/*expiry render*/}
                <div className="flex flex-col items-end w-full">
                  <span className="text-white/50 text-xs hidden md:block">
                    Expires
                  </span>

                  {/*mobile: expiry + view button footer*/}
                  <div className="flex justify-between w-full md:hidden">
                    <ExpiryDisplay />
                    <ViewButton />
                  </div>

                  {/*desktop: expiry inline with trading type*/}
                  <div className="hidden md:block">
                    <ExpiryDisplay />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:block bg-light-gray/30 h-[0.5px] my-1" />

            {/*desktop: location + view button footer*/}
            <div className="hidden md:flex items-center justify-between">
              <div className="hidden md:flex flex-col">
                <p className="underline-offset-2 text-white/50 flex text-xs gap-0.5">
                  <span className="truncate max-w-[135px]">{footerLeft}</span>
                </p>
              </div>
              <ViewButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BaseCard
