export interface CreateOrderRequest {
  reagent_id: string
  message?: string
  type: "order"
  quantity?: string
}
