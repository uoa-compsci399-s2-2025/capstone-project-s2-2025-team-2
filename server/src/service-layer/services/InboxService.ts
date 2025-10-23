import { InboxRepository } from "../../data-layer/repositories/InboxRepository"
import { UserService } from "../../data-layer/repositories/UserRepository"
import { ChatRoom, Message } from "../../business-layer/models/ChatRoom"
import { CreateChatRoomRequest } from "../dtos/request/CreateChatRoomRequest"
import { SendMessageRequest } from "../dtos/request/SendMessageRequest"
import {
  ChatRoomResponse,
  ConversationListResponse,
} from "../dtos/response/ChatRoomResponse"

export class InboxService {
  private inboxRepository = new InboxRepository()
  private userService = new UserService()

async createChatRoom(request: CreateChatRoomRequest): Promise<ChatRoom> {
  console.log("Checking for existing chat room...")
  
  // Check if chat room already exists between these users
  const existingChatRoom = await this.inboxRepository.getChatRoomByUsers(
    request.user1_id,
    request.user2_id,
  )

  if (existingChatRoom) {
    console.log("Found existing chat room:", existingChatRoom.id)
    
    // Still send the initial message to the existing chat room
    if (request.initial_message) {
      console.log("Sending initial message to existing chat room")
      await this.sendMessage({
        chat_room_id: existingChatRoom.id!,
        sender_id: request.user1_id,
        content: request.initial_message,
      })
    }
    
    return existingChatRoom
  }

  console.log("No existing chat room found, creating new one...")
  
  // Create new chat room
  const chatRoom: ChatRoom = {
    user1_id: request.user1_id,
    user2_id: request.user2_id,
    created_at: new Date(),
  }

  const createdChatRoom = await this.inboxRepository.createChatRoom(chatRoom)
  console.log("Chat room created with ID:", createdChatRoom.id)

  // If there's an initial message, create it
  if (request.initial_message) {
    console.log("Sending initial message to new chat room")
    await this.sendMessage({
      chat_room_id: createdChatRoom.id!,
      sender_id: request.user1_id,
      content: request.initial_message,
    })
    console.log("Initial message sent successfully")
  }

  return createdChatRoom
}

  async sendMessage(request: SendMessageRequest): Promise<Message> {
    const message: Message = {
      chat_room_id: request.chat_room_id,
      sender_id: request.sender_id,
      content: request.content,
      created_at: new Date(),
    }

    return await this.inboxRepository.createMessage(message)
  }

  async getConversations(userId: string): Promise<ConversationListResponse> {
    const chatRooms = await this.inboxRepository.getUserChatRooms(userId)
    const conversations: ChatRoomResponse[] = []

    for (const chatRoom of chatRooms) {
      const messages =
        await this.inboxRepository.getMessagesByChatRoomWithLimit(
          chatRoom.id!,
          50,
        )

      // Get the other user's information
      const otherUserId =
        chatRoom.user1_id === userId ? chatRoom.user2_id : chatRoom.user1_id
      const otherUser = await this.userService.getUserById(otherUserId)

      console.log("other user..")
      console.log(otherUser)

      if (otherUser) {
        conversations.push({
          chat_room: chatRoom,
          messages: messages,
          other_user: {
            id: otherUserId,
            name: otherUser.displayName || otherUser.email,
            email: otherUser.email,
          },
        })
      }
    }

    // Sort conversations by most recent message
    conversations.sort((a, b) => {
      const aLastMessage = a.messages[a.messages.length - 1]
      const bLastMessage = b.messages[b.messages.length - 1]

      if (!aLastMessage && !bLastMessage) return 0
      if (!aLastMessage) return 1
      if (!bLastMessage) return -1

      // Handle Firestore Timestamp objects
      const aTime = (aLastMessage.created_at as any)._seconds
        ? (aLastMessage.created_at as any)._seconds * 1000
        : new Date(aLastMessage.created_at).getTime()
      const bTime = (bLastMessage.created_at as any)._seconds
        ? (bLastMessage.created_at as any)._seconds * 1000
        : new Date(bLastMessage.created_at).getTime()

      return aTime - bTime
    })

    return { conversations }
  }

  async getChatRoomById(
    chatRoomId: string,
    userId: string,
  ): Promise<ChatRoomResponse | null> {
    const chatRoom = await this.inboxRepository.getChatRoomById(chatRoomId)

    if (!chatRoom) {
      return null
    }

    // Check if user is part of this chat room
    if (chatRoom.user1_id !== userId && chatRoom.user2_id !== userId) {
      throw new Error("User is not authorized to access this chat room")
    }

    const messages =
      await this.inboxRepository.getMessagesByChatRoom(chatRoomId)

    // Get the other user's information
    const otherUserId =
      chatRoom.user1_id === userId ? chatRoom.user2_id : chatRoom.user1_id
    const otherUser = await this.userService.getUserById(otherUserId)

    if (!otherUser) {
      throw new Error("Other user not found")
    }

    return {
      chat_room: chatRoom,
      messages: messages,
      other_user: {
        id: otherUserId,
        name: otherUser.displayName || otherUser.email,
        email: otherUser.email,
      },
    }
  }
}
