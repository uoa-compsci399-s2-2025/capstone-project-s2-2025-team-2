"use client"

import BaseCard from "../card/BaseCard"
import type { components } from "@/models/__generated__/schema"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & {
  id: string
  owner_id: string
  offeredReagentId?: string
}
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface OrderCardProps {
  reagent: ReagentWithId
  order: OrderWithId
  onViewDetails?: (orderId: string) => void
}

const OrderCard = ({ reagent, order, onViewDetails }: OrderCardProps) => {
  const tradingType =
    order.offeredReagentId != null
      ? "trade"
      : (order as any)?.price != null
        ? "sell"
        : "giveaway"
  return (
    <BaseCard
      {...reagent}
      reagentId={reagent.id}
      tradingType={tradingType}
      //request info modal
      onViewClick={() => onViewDetails?.(order.id)}
      //request status
      footerLeft={
        <p className="text-white/80 text-sm">
          {order.status === "approved"
            ? "Accepted"
            : order.status === "canceled"
              ? "Declined"
              : "Pending"}
        </p>
      }
    />
  )
}

export default OrderCard
