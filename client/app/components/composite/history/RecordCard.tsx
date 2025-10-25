"use client"
import type { ElementType } from "react"
import {
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"

interface RecordCardProps {
  orderId: string
  ownerName: string
  requesterName: string
  reagentId: string
  reagentName?: string
  status: string
  createdAt: string
  offeredReagentId?: string
  price?: number
}

const RecordCard = ({
  orderId,
  requesterName,
  ownerName,
  reagentName,
  status,
  createdAt,
  offeredReagentId,
  price,
}: RecordCardProps) => {
  const tradeType = price ? "Sell" : offeredReagentId ? "Trade" : "Giveaway"
  const TRADING_ICONS: Record<string, { Icon: ElementType; color: string }> = {
    sell: { Icon: CurrencyDollarIcon, color: "text-green-300" },
    trade: { Icon: ArrowsRightLeftIcon, color: "text-purple-300" },
    giveaway: { Icon: GiftIcon, color: "text-blue-200" },
  }
  const { Icon, color } =
    TRADING_ICONS[tradeType.toLowerCase()] || TRADING_ICONS.giveaway

  const statusKey = String(status).toLowerCase()
  const ownerKey = String(ownerName).toLowerCase()
  const reqKey = String(requesterName).toLowerCase()
  const ownerClasses = ownerKey === "unknown owner" ? "text-red-800" : ""
  const reqClasses = reqKey === "unknown requester" ? "text-red-800" : ""
  const statusClasses =
    statusKey === "pending"
      ? "bg-yellow-300/40 backdrop-blur-sm border border-yellow-300/90"
      : statusKey === "approved"
        ? "bg-green-300/40 backdrop-blur-sm border border-green-300/90"
        : statusKey === "canceled"
          ? "bg-red-300/40 backdrop-blur-sm border border-red-300/90"
          : "bg-gray-300/40 backdrop-blur-sm border border-gray-300/90"
  return (
    <div className="w-full border-2 border-secondary/20 px-4 py-1 rounded-2xl bg-primary/70 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div>
        <div className="md:flex justify-between items-center m-2">
          <h3 className="md:mr-10 text-lg flex items-center gap-2">
            {Icon && <Icon className={`w-5 h-5 flex-shrink-0 ${color}`} />}
            <span>{reagentName}</span>
          </h3>
          <div
            className={`shadow-xl mt-4 hidden md:block md:m-0 px-3 py-0.5 ml-4 rounded-full text-center ${statusClasses}`}
          >
            <p className="text-sm">{status}</p>
          </div>
          <div
            className={`shadow-xl w-24 md:hidden block my-2 md:m-0 px-3 py-0.5 rounded-full text-center ${statusClasses}`}
          >
            <p className="text-sm">{status}</p>
          </div>
        </div>

        <div className="md:flex gap-4 m-2">
          <p className="text-gray-300 text-sm">Order Type: {tradeType}</p>
          {!!price && (
            <span className="flex gap-1">
              <p className="text-gray-300 text-sm">Price: </p>
              <p className="text-gray-400 text-sm">{price}</p>
            </span>
          )}
          {offeredReagentId && (
            <span className="flex gap-1">
              <p className="text-gray-300 text-sm">Offered Reagent: </p>
              <p className="text-gray-400 text-sm">{offeredReagentId}</p>
            </span>
          )}
          <span className="md:flex gap-2">
            <span className="flex gap-1">
              {" "}
              <p className="text-gray-300 text-sm">Requester: </p>
              <p className={`text-gray-400 text-sm ${reqClasses}`}>
                {requesterName}
              </p>
            </span>

            <span className="flex gap-1">
              {" "}
              <p className="text-gray-300 text-sm">Owner: </p>
              <p className={`text-gray-400 text-sm ${ownerClasses}`}>
                {ownerName}
              </p>
            </span>
          </span>
          <span className="flex gap-1">
            <p className="text-gray-300 text-sm">Date: </p>
            <p className="text-gray-400 text-sm">{createdAt}</p>
          </span>
        </div>
        <div className="w-full h-[1px] bg-white/40 my-3"></div>
        <div className="m-2">
          <p>Order Id</p>
          <p className="text-gray-400 text-sm">{orderId}</p>
        </div>
      </div>
    </div>
  )
}

export default RecordCard
