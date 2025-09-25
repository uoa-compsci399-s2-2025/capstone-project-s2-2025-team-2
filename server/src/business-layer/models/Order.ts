export interface Order {
  requester_id: string
  reagent_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
  quantity?: string
}

export interface Exchange extends Order {
  offeredReagentId: string
}

export interface Trade extends Order {
  price: number
}
