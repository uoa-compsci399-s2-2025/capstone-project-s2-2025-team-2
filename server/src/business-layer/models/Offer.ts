export interface Offer {
  requester_id: string // offerer_id the user who makes the offer
  reagent_id: string
  owner_id: string // the user who wants a reagent
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
  quantity?: number
  unit?: string
  offeredReagentId: string
}

export interface TradeOffer extends Offer {
  price: number
}
