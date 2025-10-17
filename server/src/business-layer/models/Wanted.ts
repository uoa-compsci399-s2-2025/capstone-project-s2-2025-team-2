import { ReagentCategory, ReagentTradingType } from "./Reagent"


export interface Wanted {
  user_id: string
  name: string
  description: string
  location: string
  categories: ReagentCategory[]
tradingType: ReagentTradingType
createdAt: string
createdAtReadable: string
}