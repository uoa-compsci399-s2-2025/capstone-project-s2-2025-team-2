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
    <p className={`flex items-center gap-1 text-sm md:text-base ${color}`}>
      <Icon className="w-5 h-5" />
    </p>
  )

  return (
    <div className="w-full bg-primary border border-white/10 rounded-xl cursor-pointer hover:border-blue-primary/50 hover:bg-primary/80 transition-all">
      <div className="p-5 flex flex-col gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Trading Type */}
            <TradingTypeDisplay />

            {/* Title */}
            <h3 className="text-xl font-semibold text-white">
              {wanted.name}
              {wanted.tradingType === "sell" &&
                typeof wanted.price === "number" && (
                  <span className="text-white/70 text-sm font-normal ml-2">
                    • ${wanted.price.toFixed(2)}
                  </span>
                )}
              {wanted.tradingType === "trade" && offeredReagentName && (
                <Link
                  href={`/marketplace/${(wanted as any).requesterOfferedReagentId}`}
                  className="text-white/70 text-sm font-normal ml-2 hover:underline"
                >
                  • offering: {offeredReagentName}
                </Link>
              )}
            </h3>
          </div>

          <div className="flex flex-wrap items-start gap-y-2 gap-x-2 md:gap-x-4">
            {/* User */}
            <div className="flex items-center gap-0.5 text-white/60">
              <UserIcon className="w-4 h-4" />
              <span className="text-xs">
                {requesterInfo?.displayName || requesterInfo?.preferredName},{" "}
                {wanted?.location || "Unknown University"}
              </span>
            </div>
            {/* Expiring Date */}
            <div className="flex items-center gap-1 text-warning">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs">
                {wanted.expiryDate || "No date specified"}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white line-clamp-2 leading-relaxed">
            {onViewDetails ? offer.message : wanted.description}
          </p>
        </div>

        <div className="flex flex-row justify-between text-sm">
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mt-1">
            {wanted.categories.map((cat, i) => (
              <span
                key={i}
                className="bg-secondary/40 text-white text-xs px-2 py-1.5 rounded-lg backdrop-blur-sm"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* ContactButton on Marketplace page */}
          {showContactButton && isSignedIn && (
            <ContactButton wanted={wanted} className="md:ml-auto" />
          )}

          {/* View Details button on Orders page */}
          {onViewDetails && offer && (
            <button
              onClick={() => onViewDetails(offer.id)}
              className="flex items-center gap-0.5 px-2 py-1.5 text-sm font-medium text-white bg-blue-primary hover:bg-blue-primary/70 rounded-lg transition-colors cursor-pointer"
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
