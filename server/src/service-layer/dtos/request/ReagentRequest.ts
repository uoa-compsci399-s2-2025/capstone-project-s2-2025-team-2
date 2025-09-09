import type {
  ReagentCategory,
  ReagentTradingType,
  ReagentVisibility,
} from "business-layer/models/Reagent"

export interface CreateReagentRequest {
  userId: string
  name: string
  description: string
  categories: ReagentCategory[]
  visibility: ReagentVisibility
  price?: number
  quantity: number
  unit: string
  expiryDate: string
  tradingType: ReagentTradingType
  location: string
  images?: string[]
}