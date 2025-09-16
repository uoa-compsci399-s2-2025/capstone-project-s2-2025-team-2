export interface Order {
  id?: string
  req_id: string
  owner_id: string
  reagent_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
}