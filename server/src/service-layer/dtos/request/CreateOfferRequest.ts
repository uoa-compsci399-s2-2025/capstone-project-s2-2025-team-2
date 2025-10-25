export interface CreateOfferRequest {
  reagent_id: string
  message?: string
  offeredReagentId: string
  quantity?: number
  type: "order"
  unit?: string
}
