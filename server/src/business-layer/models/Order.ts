export interface Order {
  requester_id: string
  reagent_id: string
  owner_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
}
