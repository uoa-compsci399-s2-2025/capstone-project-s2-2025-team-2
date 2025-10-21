import type {
  ReagentCategory,
  ReagentTradingType,
} from "../../../business-layer/models/Reagent"

export interface CreateWantedRequest {
  name: string
  description: string
  location: string
  categories: ReagentCategory[]
  tradingType: ReagentTradingType
  requesterOfferedReagentId?: string
  price?: number
}
