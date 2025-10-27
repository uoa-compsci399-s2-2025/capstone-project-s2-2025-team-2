export interface CreateOfferExchangeRequest {
  reagent_id: string
  message?: string
  offeredReagentId: string
  quantity?: number
  type: "exchange"
  unit?: string
}
