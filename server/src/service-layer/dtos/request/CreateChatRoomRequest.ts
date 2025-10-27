export interface CreateChatRoomRequest {
  user1_id: string
  user2_id: string
  reagent_id: string
  order_id?: string
  initial_message?: string
}
