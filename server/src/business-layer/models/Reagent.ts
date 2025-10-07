export type ReagentTradingType = "trade" | "giveaway" | "sell"
export type ReagentCategory = "chemical" | "hazardous" | "biological"
export type ReagentVisibility =
  | "everyone"
  | "region"
  | "institution"
  | "private"

export interface Reagent {
  user_id: string
  name: string
  description: string
  condition: string
  price?: number
  quantity: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  categories: ReagentCategory[]
  createdAt?: FirebaseFirestore.Timestamp
  createdAtReadable?:string
  location: string
  unit: string
  visibility?: ReagentVisibility
}
