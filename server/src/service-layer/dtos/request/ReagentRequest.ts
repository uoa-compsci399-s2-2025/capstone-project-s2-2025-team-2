import type {
  ReagentCategory,
  ReagentTradingType,
} from "business-layer/models/Reagent"

export interface CreateReagentRequest {
  name: string
  description: string
  condition: string
  categories: ReagentCategory[]
  price?: number
  quantity: number
  expiryDate: string
  tradingType: ReagentTradingType
  location: string
  images?: string[]
}
