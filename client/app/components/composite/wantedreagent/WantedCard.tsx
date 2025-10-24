"use client"
import { useEffect, useState } from "react"
import {
  UserIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ArrowsRightLeftIcon,
  ClockIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../config/firebase"
import ContactButton from "./ContactButton"
import Link from "next/link"

type ReagentCategory = "chemical" | "hazardous" | "biological"
type ReagentTradingType = "trade" | "giveaway" | "sell"

interface WantedReagent {
  id: string
  name: string
  description: string
  createdAt: string
  createdAtReadable: string
  user_id: string
  userName?: string
  price?: number
  categories: ReagentCategory[]
  tradingType: ReagentTradingType
  location: string
  expiryDate: string
}

interface WantedCardProps {
  wanted: WantedReagent
  requesterInfo?: any
  offeredReagentName?: string | null
  onViewDetails?: (offerId: string) => void
  offer?: any
  showContactButton?: boolean
}

//trading type display style mapping
const TRADING_TYPE_STYLES = {
  giveaway: { color: "text-blue-100", icon: GiftIcon },
  sell: { color: "text-green-100", icon: CurrencyDollarIcon },
  trade: { color: "text-purple-100", icon: ArrowsRightLeftIcon },
} as const

const BG_LAYERS = [
  { backgroundColor: "rgba(204, 204, 204)" },
  { backgroundColor: "rgba(0, 0, 0, 0.9)" },
  { backgroundColor: "rgba(255, 255, 255, 0.06)" },
]

const WantedCard = ({
  wanted,
  requesterInfo,
  offeredReagentName,
  onViewDetails,
  offer,
  showContactButton,
}: WantedCardProps) => {
  const [isSignedIn, setIsSignedIn] = useState(false)

  //reusable components for both mobile and desktop view
  const tradingTypeLabel =
    wanted.tradingType[0].toUpperCase() + wanted.tradingType.slice(1)

  //check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user)
    })
    return () => unsubscribe()
  }, [])

  const tradingType = wanted.tradingType as keyof typeof TRADING_TYPE_STYLES
  const tradingStyle =
    TRADING_TYPE_STYLES[tradingType] ?? TRADING_TYPE_STYLES.giveaway
  const color = tradingStyle.color
  const Icon = tradingStyle.icon

  const TradingTypeDisplay = () => (
    <div className={`flex items-center gap-1 text-sm md:text-base ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  )

  return (
    <div className="w-full border border-white/20 rounded-xl cursor-pointer hover:border-blue-primary/50 transition-all relative">
      {BG_LAYERS.map((style, i) => (
        <div key={i} className="absolute inset-0 rounded-xl" style={style} />
      ))}
      <div className="relative p-5 flex flex-col gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Trading Type */}
            <TradingTypeDisplay />

            {/* Title */}
            <h3 className="text-white text-base md:text-lg tracking-wider leading-normal font-semibold truncate max-w-9/10">
              {wanted.name}
              {wanted.tradingType === "sell" &&
                typeof wanted.price === "number" && (
                  <span className="text-white/80 text-sm font-normal ml-2">
                    • ${wanted.price.toFixed(2)}
                  </span>
                )}
              {wanted.tradingType === "trade" && offeredReagentName && (
                <Link
                  href={`/marketplace/${(wanted as any).requesterOfferedReagentId}`}
                  className="text-white/80 text-sm font-normal ml-2 hover:underline"
                >
                  • offering: {offeredReagentName}
                </Link>
              )}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3">
            {/* User */}
            <div className="flex items-center gap-1 text-white/70">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm">
                {requesterInfo?.displayName || requesterInfo?.preferredName},{" "}
                {wanted?.location || "Unknown University"}
              </span>
            </div>
            {/* Expiring Date */}
            <div className="flex items-center gap-1 text-warning">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm">
                {wanted.expiryDate || "No date specified"}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-white text-sm md:text-base leading-relaxed line-clamp-2 mt-4">
            {onViewDetails ? offer.message : wanted.description}
          </p>
        </div>

        <div className="flex flex-row justify-between items-center">
          {/* Categories */}
          <div className="flex flex-wrap gap-1">
            {wanted.categories.map((cat, i) => (
              <span
                key={i}
                className="bg-secondary/20 text-white text-xs md:text-sm px-2 py-1 rounded backdrop-blur-sm"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* ContactButton on Marketplace page */}
          {showContactButton && isSignedIn && (
            <ContactButton wanted={wanted} className="ml-auto" />
          )}

          {/* View Details button on Orders page */}
          {onViewDetails && offer && (
            <button
              onClick={() => onViewDetails(offer.id)}
              className="flex items-center gap-0.5 px-2 py-1.5 text-xs md:text-sm font-medium text-white bg-blue-primary hover:bg-blue-primary/70 rounded-lg transition-colors cursor-pointer ml-auto"
            >
              View
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WantedCard
