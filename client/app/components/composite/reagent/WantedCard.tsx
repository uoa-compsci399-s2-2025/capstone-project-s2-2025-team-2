"use client"

import { UserIcon, CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"

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

  return (
    <div
      className="w-full max-w-[535px] bg-primary border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-blue-primary/50 transition-all"
      onClick={onViewClick}
    >

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-xl font-semibold text-white tracking-wide">
          {wanted.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/70 line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {wanted.description}
        </p>

        {/* Footer with user, date, and price */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
          {/* User */}
          <div className="flex items-center gap-2 text-white/60">
            <UserIcon className="w-5 h-5" />
            <span className="text-sm truncate max-w-[120px]">
              {wanted.userName || wanted.user_id}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-2 text-white/60">
            <CalendarIcon className="w-5 h-5" />
            <span className="text-sm whitespace-nowrap">
              {wanted.createdAtReadable}
            </span>
          </div>

          {/* Price (if available) */}
          {wanted.price !== undefined && (
            <div className="flex items-center gap-1 text-green-100">
              <CurrencyDollarIcon className="w-5 h-5" />
              <span className="text-sm font-medium">
                {wanted.price} USDT
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WantedCard
