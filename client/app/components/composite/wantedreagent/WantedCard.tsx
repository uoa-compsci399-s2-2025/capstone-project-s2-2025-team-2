"use client"
import { useEffect, useState } from "react"
import {
  UserIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ArrowsRightLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline"
import client from "@/app/services/fetch-client"
import Button from "../../generic/button/regular/Button"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../config/firebase"
import ContactButton from "./ContactButton"

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
}

interface WantedCardProps {
  wanted: WantedReagent
  onViewClick?: () => void
}

//trading type display style mapping
const TRADING_TYPE_STYLES = {
  giveaway: { color: "text-blue-100", icon: GiftIcon },
  sell: { color: "text-green-100", icon: CurrencyDollarIcon },
  trade: { color: "text-purple-100", icon: ArrowsRightLeftIcon },
} as const

const WantedCard = ({ wanted, onViewClick }: WantedCardProps) => {
  const [requesterInfo, setRequesterInfo] = useState<any>(null)
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

  //fetch requester info using user id
  useEffect(() => {
    if (!wanted?.user_id) return

    const fetchRequesterInfo = async () => {
      try {
        const { data } = await client.GET(`/users/${wanted.user_id}` as any, {})
        if (data) {
          setRequesterInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch requester information:", error)
      }
    }

    fetchRequesterInfo()
  }, [wanted?.user_id])

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
    <div
      className="w-full bg-primary border border-white/10 rounded-xl cursor-pointer hover:border-blue-primary/50 hover:bg-primary/80 transition-all"
      onClick={onViewClick}
    >
      <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Trading Type */}

            <TradingTypeDisplay />
            {/* Title */}

            <h3 className="text-xl font-semibold text-white">{wanted.name}</h3>
            {/* Categories */}

            <div className="flex flex-wrap gap-1">
              {wanted.categories.map((cat, i) => (
                <span
                  key={i}
                  className="bg-background/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
            {wanted.description}
          </p>
        </div>

        <div className="flex flex-col gap-4 md:gap-2 text-sm">
          {/* Contact Button */}
          {isSignedIn && (
            <ContactButton wanted={wanted} className="md:ml-auto" />
          )}
          <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center gap-2 md:gap-4">
            {/* User */}
            <div className="flex items-center gap-2 text-white/60">
              <UserIcon className="w-5 h-5" />
              <span className="truncate max-w-[120px]">
                {requesterInfo?.displayName || requesterInfo?.preferredName}
              </span>
            </div>
            {/* University */}
            <div className="flex items-center gap-2 text-white/60">
              <HomeIcon className="w-5 h-5" />
              <span className="whitespace-nowrap">
                {wanted?.location || "Unknown University"}
              </span>
            </div>
            {/*Listed Date */}
            <div className="flex items-center gap-2 text-white/60">
              <CalendarIcon className="w-5 h-5" />
              <span className="whitespace-nowrap">
                {wanted.createdAtReadable}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WantedCard
