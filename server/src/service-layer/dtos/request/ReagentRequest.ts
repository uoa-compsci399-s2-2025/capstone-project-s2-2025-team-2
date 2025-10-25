import type {
  ReagentCategory,
  ReagentTradingType,
  ReagentVisibility,
} from "../../../business-layer/models/Reagent"

export interface CreateReagentRequest {
  name: string
  description?: string
  condition: string
  categories: ReagentCategory[]
  price?: number
  quantity: number
  unit: string
  expiryDate: string
  tradingType: ReagentTradingType
  location: string
  images?: string[]
  visibility?: ReagentVisibility
  restricted: boolean
}
