"use client"

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
  requesterOfferedReagentId?: string
}

interface ContactButtonProps {
  wanted: WantedReagent
  offer?: any
  onViewDetails: (offerId: string) => void
  className?: string
}

const OrderButton = ({
  offer,
  onViewDetails,
  className = "",
}: ContactButtonProps) => {
  const handleViewDetails = () => {
    if (offer?.id) {
      onViewDetails(offer.id)
    }
  }

  return (
    <div className={className}>
      <button
        onClick={handleViewDetails}
        className="px-3 py-1.5 text-xs font-medium bg-blue-primary/20 text-blue-primary border border-blue-primary/40 rounded-md hover:bg-blue-primary/30 hover:border-blue-primary/60 transition-all"
      >
        View Details
      </button>
    </div>
  )
}

export default OrderButton
