"use client"
import { useEffect, useState } from "react"
import { UserIcon, CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import client from "@/app/services/fetch-client"

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

const WantedCard = ({ wanted, onViewClick }: WantedCardProps) => {
  const [requesterInfo, setRequesterInfo] = useState<any>(null)

  //fetch requester info using user id
  useEffect(() => {
    if (!wanted?.user_id) return

    const fetchRequesterInfo = async () => {
      try {
        const { data } = await client.GET(
          `/users/${wanted.user_id}` as any,
          {},
        )
        if (data) {
          setRequesterInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch requester information:", error)
      }
    }

    fetchRequesterInfo()
  }, [wanted?.user_id])
  return (
    <div
      className="w-full bg-primary border border-white/10 rounded-xl cursor-pointer hover:border-blue-primary/50 hover:bg-primary/80 transition-all"
      onClick={onViewClick}
    >
      <div className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div className="flex-1 space-y-2">
          {/* Title */}
          <h3 className="text-xl font-semibold text-white tracking-wide">
            {wanted.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
            {wanted.description}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
          <div className="flex flex-col gap-2">
            {/* User */}
            <div className="flex items-center gap-2 text-white/60">
              <UserIcon className="w-5 h-5" />
              <span className="truncate max-w-[120px]">
                {requesterInfo?.displayName || requesterInfo?.preferredName}
              </span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-white/60">
              <CalendarIcon className="w-5 h-5" />
              <span className="whitespace-nowrap">
                {wanted.createdAtReadable}
              </span>
            </div>
          </div>

          {/* Price (if available) */}
          {wanted.price !== undefined && (
            <div className="flex items-center gap-1 text-green-100 font-medium">
              <CurrencyDollarIcon className="w-5 h-5" />
              <span>{wanted.price}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WantedCard
