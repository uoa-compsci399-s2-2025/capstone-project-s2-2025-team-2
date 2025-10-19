export interface CreateOfferRequest {
     wanted_id: string
     message?: string
     type: "order"
     quantity?: number
     unit?: string
}