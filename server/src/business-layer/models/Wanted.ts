export type ReagentTradingType = "trade" | "giveaway" | "sell"
export type ReagentCategory = "chemical" | "hazardous" | "biological"

export interface Wanted {
  user_id: string
  name: string
  description: string
  location: string
  categories: ReagentCategory[]
tradingType: ReagentTradingType
createdAt: string
createdAtReadable: string
}