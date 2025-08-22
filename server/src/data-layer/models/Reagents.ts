export enum ReagentTradingType {
     TRADE = "trade",
     GIVEAWAY = "giveaway",
     SELL = "sell",
}

export enum ReagentCategory {
    CHEMICAL = "chemical",
    HAZARDOUS = "hazardous",
    BIOLOGICAL = "biological",
}

export interface Reagent {
  id: string
  userId: string
  name: string
  description: string
  price?: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  categories: ReagentCategory[]
}
