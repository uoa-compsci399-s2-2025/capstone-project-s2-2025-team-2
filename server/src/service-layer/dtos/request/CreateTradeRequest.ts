export interface CreateTradeRequest {
  reagent_id: string
  message?: string
  price: number
  type: "trade"
}
