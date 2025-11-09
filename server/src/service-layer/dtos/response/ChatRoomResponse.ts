import { ChatRoom, Message } from "../../../business-layer/models/ChatRoom"

export interface ChatRoomResponse {
  chat_room: ChatRoom
  messages: Message[]
  other_user: {
    id: string
    name: string
    email: string
  }
  reagent_name?: string
}

export interface ConversationListResponse {
  conversations: ChatRoomResponse[]
}
