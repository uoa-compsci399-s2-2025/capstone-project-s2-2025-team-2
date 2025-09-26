"use client"

import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import BaseCard from "../card/BaseCard"
import type { components } from "@/models/__generated__/schema"
import { getCurrentUser } from "@/app/services/firebase-auth"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & { id: string; owner_id: string }
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface OrderCardProps {
  reagent: ReagentWithId
  order: OrderWithId
  onApprove?: (orderId: string) => void
  onDecline?: (orderId: string) => void
}

const OrderCard = ({ reagent, order, onApprove, onDecline }: OrderCardProps) => {
  //reusable styling
  const btnStyle = "flex items-center justify-center gap-0.5 w-8 h-8 rounded-lg"
  const iconStyle = "w-5 h-5"

  return (
    <BaseCard
      {...reagent}
      reagentId={reagent.id}

      //conditional rendering for approve/decline
      footerLeft={
        order.status === "pending" ? (
          <div className="flex items-center gap-2 text-white">
            {getCurrentUser()?.uid === order.owner_id && (
              <button
                onClick={() => onApprove?.(order.id)}
                className={`${btnStyle} bg-green-500/80 hover:bg-green-500`}
              >
                <CheckIcon className={iconStyle} />
              </button>
            )}
            <button
              onClick={() => onDecline?.(order.id)}
              className={`${btnStyle} bg-red-500/80 hover:bg-red-500`}
            >
              <XMarkIcon className={iconStyle} />
            </button>
          </div>
        ) : (
          
          //order status
          <p className="text-white/80 text-sm">
            {order.status === "approved" ? "Accepted" : "Declined"}
          </p>
        )
      }
    />
  )
}

export default OrderCard