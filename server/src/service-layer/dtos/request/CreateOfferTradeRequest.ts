export interface CreateOfferTradeRequest {
  reagent_id: string
  message?: string
  price: number
  offeredReagentId: string
  quantity?: number
  type: "trade"
  unit?: string
}
