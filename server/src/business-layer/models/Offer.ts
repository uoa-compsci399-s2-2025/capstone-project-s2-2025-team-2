export interface Offer {
  requester_id: string
  reagent_id: string
  owner_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
  quantity?: number
  unit?: string
  offeredReagentId: string
}

export interface ExchangeOffer extends Offer {
  offeredReagentId: string
}

export interface TradeOffer extends Offer {
  price: number
}
