import { Reagent } from "./Reagent"
export interface Order {
  requester_id: string
  reagent_id: string
  owner_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
  quantity?: number
  unit?: string
  bounty_id?: string 
}

export interface Exchange extends Order {
  offeredReagentId: string
}

export interface Trade extends Order {
  price: number
}

export interface OrderWithReagent extends Order {
  id: string
  reagent?: Reagent | null
}
