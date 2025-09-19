export interface Order {
  order_id: string
  requester_id: string
  reagent_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
}
