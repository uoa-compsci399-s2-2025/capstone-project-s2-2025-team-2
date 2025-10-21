export interface CreateOfferExchangeRequest {
  reagent_id: string
  message?: string
  offeredReagentId: string
  requesterOfferedReagentId: string
  quantity?: number
  type: "exchange"
  unit?: string
}
