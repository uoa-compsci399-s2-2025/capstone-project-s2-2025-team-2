export interface ChatRoom {
  id?: string
  user1_id: string
  user2_id: string
  reagent_id?: string
  reagent_name?: string
  order_id?: string
  created_at: Date
}

export interface Message {
  id?: string
  chat_room_id: string
  sender_id: string
  content: string
  created_at: Date
}
