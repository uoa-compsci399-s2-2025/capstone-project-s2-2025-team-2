export interface Order {
  requester_id: string
  reagent_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
}

export interface Exchange extends Order {
  offeredReagentId: string
  quantity: number
}

export interface Trade extends Order {
  price: number
}
