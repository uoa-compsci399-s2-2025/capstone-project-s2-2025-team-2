export default interface ChatRoomResponseDto {
  chat_room: {
    id?: string
    user1_id: string
    user2_id: string
    created_at: string
  }
  messages: MessageDto[]
  other_user: {
    id: string
    name: string
    email: string
  }
  reagent_name?: string 
}

export interface MessageDto {
  id?: string
  chat_room_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface ConversationListResponseDto {
  conversations: ChatRoomResponseDto[]
}
