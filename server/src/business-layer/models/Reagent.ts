export type ReagentTradingType = "trade" | "giveaway" | "sell"

export type ReagentCategory = "chemical" | "hazardous" | "biological"

export type ReagentVisibility = "everyone" | "region" | "institution"

export interface Reagent {
  userId: string
  name: string
  description: string
  price?: number
  quantity: number
  unit: string
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  categories: ReagentCategory[]
  visibility: ReagentVisibility
  location: string
}
