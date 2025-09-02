import type {
  ReagentCategory,
  ReagentTradingType,
} from "business-layer/models/Reagent"

export interface CreateReagentRequest {
  userId: string
  name: string
  description: string
  categories: ReagentCategory[]
  price?: number
  expiryDate: string
  tradingType: ReagentTradingType
  images?: string[]
}
