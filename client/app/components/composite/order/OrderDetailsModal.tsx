"use client"

import {
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import type { components } from "@/models/__generated__/schema"
import client from "@/app/services/fetch-client"
import { toast } from "sonner"
import LoadingState from "../loadingstate/LoadingState"
import { is } from "zod/v4/locales"
import { auth } from "@/app/config/firebase"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & {
  id: string
  owner_id: string
  offeredReagentId?: string
}
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & {
  id: string
  requesterOfferedReagentId?: string
}
interface EnrichedWantedReagent {
  id: string
  name: string
  description: string
  createdAt: string
  createdAtReadable: string
  user_id: string
  price?: number
  categories: any[]
  tradingType: string
  location: string
  expiryDate: string
  requesterInfo?: any
  offeredReagentName?: string | null
  requesterOfferedReagentId?: string
}

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderWithId | any
  reagent: ReagentWithId | EnrichedWantedReagent
  offeredReagent?: ReagentWithId
  onApprove?: (orderId: string) => void
  isOfferDetails?: boolean
}

const TRADING_CONFIG = {
  giveaway: { icon: GiftIcon, color: "text-blue-100" },
  sell: { icon: CurrencyDollarIcon, color: "text-green-100" },
  trade: { icon: ArrowsRightLeftIcon, color: "text-purple-100" },
} as const

const useFetch = <T,>(url: string | null, isOpen: boolean) => {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen || !url) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("authToken")
        const response = await client.GET(url as any, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setData(response.data as T)
      } catch (error) {
        console.error(`Fetch failed: ${url}`, error)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, isOpen])

  return { data, loading }
}

const DetailRow = ({
  label,
  value,
  truncate = false,
}: {
  label: string
  value?: string | number
  truncate?: boolean
}) => (
  <div className="flex justify-between">
    <span className="text-gray-300">{label}:</span>
    <span
      className={`text-white ${truncate ? "truncate max-w-[150px]" : ""}`}
      title={truncate && value ? String(value) : undefined}
    >
      {value ?? "N/A"}
    </span>
  </div>
)

const ReagentDetails = ({
  title,
  reagent,
  offerDetails = false,
  requesterOfferedReagentName,
  offerPrice: price,
}: {
  title: string
  reagent: any
  offerDetails?: boolean
  requesterOfferedReagentName?: string | null
  offerPrice?: string | number
}) => (
  <div className="bg-primary/80 backdrop-blur-sm rounded-2xl p-6 border border-muted shadow-xl w-fit min-w-[300px] h-fit">
    <h3 className="text-white text-lg font-medium mb-4">{title}</h3>
    <div className="space-y-3">
      <DetailRow label="Name" value={reagent?.name} truncate />
      {!offerDetails && (
        <>
          <DetailRow label="Condition" value={reagent?.condition} />
          <DetailRow
            label="Quantity"
            value={`${reagent?.quantity} ${reagent?.unit}`}
          />
          <DetailRow label="Expiry" value={reagent?.expiryDate} />
        </>
      )}
      {reagent.requesterOfferedReagentId && (
        <>
          <DetailRow
            label="Your Offered Reagent"
            value={
              requesterOfferedReagentName ?? reagent.requesterOfferedReagentId
            }
            truncate
          />
        </>
      )}

      <DetailRow label="Location" value={reagent?.location} truncate />
      {offerDetails && reagent.price>0 && (
        <DetailRow label="Offered Price" value={`$${price}`} />
      )}
      {reagent?.categories?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-4">
          {reagent.categories.map((cat: string) => (
            <span
              key={cat}
              className="bg-secondary/20 text-white text-xs px-2 py-1 rounded"
            >
              {cat}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
)

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  reagent,
  offeredReagent: testOfferedReagent,
  onApprove,
  isOfferDetails = false,
}: OrderDetailsModalProps) {
  const currentUserId = auth?.currentUser?.uid
  const isOwner = currentUserId === order?.owner_id
  const [approving, setApproving] = useState(false)
  const [approved, setApproved] = useState(false)

  const { data: requesterData } = useFetch<any>(
    order.requester_id ? `/users/${order.requester_id}` : null,
    isOpen,
  )

  const { data: fetchedRequesterOfferedReagent } = useFetch<any>(
    reagent.tradingType === "trade" && reagent.requesterOfferedReagentId
      ? `/reagents/${reagent.requesterOfferedReagentId}`
      : null,
    isOpen,
  )

  const { data: fetchedOfferedReagent, loading: offeredReagentLoading } =
    useFetch<any>(
      order.offeredReagentId && !testOfferedReagent
        ? `/reagents/${order.offeredReagentId}`
        : null,
      isOpen,
    )

  const offeredReagent = testOfferedReagent || fetchedOfferedReagent
  const isTradeLoading =
    (reagent.tradingType === "trade" || isOfferDetails) &&
    !testOfferedReagent &&
    (offeredReagentLoading ||
      (!fetchedOfferedReagent && !!order.offeredReagentId))

  const handleApprove = async () => {
    setApproving(true)
    try {
      const token = localStorage.getItem("authToken")
      if (isOfferDetails) {
        await client.PATCH(`/offers/${order.id}/approve` as any, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await client.PATCH(`/orders/${order.id}/approve` as any, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      toast("Request approved!")
      setApproved(true)
      onApprove?.(order.id)
    } catch (error) {
      console.error("Failed to approve order:", error)
      toast("Failed to approve request. Please try again.")
      setApproving(false)
    }
  }

  if (!isOpen) return null

  if (isTradeLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 backdrop-blur-sm bg-black/20"
          onClick={onClose}
        />
        <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white hover:text-gray-300 z-20"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <div className="flex items-center justify-center min-h-[400px] min-w-[400px]">
            <LoadingState pageName="Order Details" />
          </div>
        </div>
      </div>
    )
  }

  const requesterName = !requesterData
    ? "Unknown User"
    : (requesterData.preferredName || requesterData.displayName)
        ?.charAt(0)
        .toUpperCase() +
        (requesterData.preferredName || requesterData.displayName)
          ?.slice(1)
          .toLowerCase() || "Unknown User"

  const tradingType = reagent.tradingType as keyof typeof TRADING_CONFIG
  const { icon: Icon, color } = TRADING_CONFIG[tradingType]
  const label = tradingType.charAt(0).toUpperCase() + tradingType.slice(1)

  const price = (order as any).price ?? reagent.price
  const hasPrice = price !== null && price !== undefined && `${price}` !== ""
  const gridCols =
    reagent.tradingType === "trade" || isOfferDetails
      ? "lg:grid-cols-3 max-w-7xl"
      : "lg:grid-cols-2 max-w-5xl"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black/20"
        onClick={onClose}
      />

      <div className="bg-primary/20 backdrop-blur-sm rounded-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-gray-300 z-20"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div
          className={`grid grid-cols-1 gap-8 w-full pointer-events-auto relative z-10 items-start ${gridCols}`}
        >
          <ReagentDetails
            title={isOfferDetails ? "Your Request:" : "Your Reagent:"}
            reagent={reagent}
            offerDetails={isOfferDetails}
            requesterOfferedReagentName={
              fetchedRequesterOfferedReagent?.name ?? undefined
            }
            offerPrice={hasPrice ? price : undefined}
          />

          {!isOfferDetails &&
            reagent.tradingType === "trade" &&
            offeredReagent && (
              <ReagentDetails title="Their Reagent:" reagent={offeredReagent} />
            )}

          {isOfferDetails && offeredReagent && (
            <ReagentDetails title="Their Reagent:" reagent={offeredReagent} />
          )}

          <div className="bg-primary/80 backdrop-blur-sm rounded-2xl p-6 border border-muted shadow-xl flex flex-col w-fit min-w-[300px] h-fit">
            <div className="space-y-4">
              <h3 className="text-white text-lg font-medium flex items-center gap-1.5">
                <span className={`flex items-center gap-1 text-lg ${color}`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </span>
                <span className="text-lg">
                  {isOfferDetails ? "Offer" : "Request"}
                </span>
              </h3>

              <div className="space-y-3">
                <DetailRow
                  label={isOfferDetails ? "Offerer" : "Requester"}
                  value={requesterName}
                  truncate
                />
                <DetailRow
                  label="Status"
                  value={
                    order.status?.charAt(0).toUpperCase() +
                    order.status?.slice(1).toLowerCase()
                  }
                />

                {!isOfferDetails && hasPrice && (
                  <DetailRow label="Offered Price" value={`$${price}`} />
                )}

                {typeof order.message === "string" &&
                  order.message.trim().length > 0 && (
                    <div className="flex flex-col max-w-[280px]">
                      <span className="text-gray-300 mb-1">Message:</span>
                      <span className="text-white text-sm break-words max-h-20 overflow-y-auto">
                        {order.message}
                      </span>
                    </div>
                  )}
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/inbox")}
              className="w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-blue-primary hover:bg-blue-primary/70 rounded-lg transition-colors cursor-pointer"
            >
              Chat
            </button>
            {isOwner && (
              <button
                onClick={handleApprove}
                disabled={approving || approved}
                className="w-full px-4 py-2 mt-6 text-sm font-medium text-white bg-blue-primary hover:bg-blue-primary/70 disabled:bg-blue-primary/50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {approved ? "Approved" : approving ? "Approving..." : "Approve"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
