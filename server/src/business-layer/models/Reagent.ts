export type ReagentTradingType = "trade" | "giveaway" | "sell"

export type ReagentCategory = "chemical" | "hazardous" | "biological"

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
  createdAt: Date
  location: string
}
