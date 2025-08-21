import { ReagentType, ReagentCategory } from "types/enums"

export interface User {
  username: string
}

export interface Reagent {
  name: string
  description: string  
  price?: number
  expiryDate: string
  type: ReagentType
  images?: string[]
  categories: ReagentCategory[]
}
