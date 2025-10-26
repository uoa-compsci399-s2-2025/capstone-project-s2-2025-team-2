export interface ChatRoom {
  id?: string
  user1_id: string
  user2_id: string
  created_at: Date
  last_message?: {
    content: string
    created_at: Date
    sender_id: string
  }
}

export interface Message {
  id?: string
  chat_room_id: string
  sender_id: string
  content: string
  created_at: Date
}
