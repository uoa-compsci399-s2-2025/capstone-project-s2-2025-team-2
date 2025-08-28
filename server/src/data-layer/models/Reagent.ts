export enum ReagentTradingType {
  Trade = "trade",
  Giveaway = "giveaway",
  Sell = "sell",
}

export enum ReagentCategory {
  Chemical = "chemical",
  Hazardous = "hazardous",
  Biological = "biological",
}

export interface Reagent {
  userId: string
  name: string
  description: string
  price?: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  categories: ReagentCategory[]
}
