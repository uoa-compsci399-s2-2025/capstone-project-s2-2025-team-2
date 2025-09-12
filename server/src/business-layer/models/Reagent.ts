import { Timestamp } from "firebase-admin/firestore"
export type ReagentTradingType = "trade" | "giveaway" | "sell"

export type ReagentCategory = "chemical" | "hazardous" | "biological"

export interface Reagent {
  user_id: string
  name: string
  description: string
  price?: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  categories: ReagentCategory[]
  createdAt: Timestamp
  location: string
}
