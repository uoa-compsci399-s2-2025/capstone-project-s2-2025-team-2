import { Timestamp } from "firebase-admin/firestore"
export type ReagentTradingType = "trade" | "giveaway" | "sell"

export type ReagentCategory = "chemical" | "hazardous" | "biological"

export interface Reagent {
  id: string
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
  createdAt: Timestamp
  location: string
}
