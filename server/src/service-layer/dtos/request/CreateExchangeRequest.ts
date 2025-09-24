export interface CreateExchangeRequest {
  reagent_id: string
  message?: string
  offeredReagentId: string
  quantity?: string
  type: "exchange"
}
