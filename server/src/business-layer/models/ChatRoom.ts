export interface ChatRoom {
  id?: string
  user1_id: string
  user2_id: string
  created_at: Date
  order_id?: string 
  offer_id?: string 
  reagent_id?: string 
}

export interface Message {
  id?: string
  chat_room_id: string
  sender_id: string
  content: string
  created_at: Date
}
