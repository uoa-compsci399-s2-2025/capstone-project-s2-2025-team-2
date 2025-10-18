import { Reagent } from "./Reagent"

export interface Wanted
  extends Omit<Reagent, "condition" | "quantity" | "unit" | "expiryDate"> {}
