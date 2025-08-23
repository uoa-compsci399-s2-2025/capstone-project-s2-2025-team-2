import type {
  ReagentCategory,
  ReagentTradingType,
} from "data-layer/models/Reagent"

export interface CreateReagentRequest {
  userId: string
  name: string
  description: string
  categories: string[]
  price?: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
  category: ReagentCategory[]
}
