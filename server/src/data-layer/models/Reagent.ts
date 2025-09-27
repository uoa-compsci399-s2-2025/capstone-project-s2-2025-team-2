export type ReagentTradingType = "trade" | "giveaway" | "sell"

export type ReagentCategory = "chemical" | "hazardous" | "biological"

export type ReagentVisibility =
  | "everyone"
  | "region"
  | "institution"
  | "private"

export interface Reagent {
  userId: string
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
  unit: string
  visibility?: ReagentVisibility
}
