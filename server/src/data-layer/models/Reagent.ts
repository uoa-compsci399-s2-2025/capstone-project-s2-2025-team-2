export type ReagentTradingType = "trade" | "giveaway" | "sell"

export type ReagentCategory = "chemical" | "hazardous" | "biological"

export interface Reagent {
  name: string
  description: string
  price?: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  categories: ReagentCategory[]
}
