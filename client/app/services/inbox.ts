import CreateChatRoomRequestDto from "../models/request-models/CreateChatRoomRequestDto"
import SendMessageRequestDto from "../models/request-models/SendMessageRequestDto"
import ChatRoomResponseDto, {
  ConversationListResponseDto,
} from "../models/response-models/ChatRoomResponseDto"
import client from "./fetch-client"
import { getIdToken } from "./firebase-auth"

//            function: getAuthHeaders           //
const getAuthHeaders = async () => {
  const idToken = await getIdToken()
  return {
    Authorization: `Bearer ${idToken}`,
  }
}

//            function: createChatRoom           //
export const createChatRoom = async (
  requestBody: CreateChatRoomRequestDto,
): Promise<ChatRoomResponseDto> => {
  const authHeaders = await getAuthHeaders()

  const response = await client.POST("/inbox/chatroom", {
    body: requestBody,
    headers: authHeaders,
  })

  if (response.error) {
    throw new Error("Creating chat room failed")
  }

  return response.data
}

//            function: sendMessage           //
export const sendMessage = async (
  requestBody: SendMessageRequestDto,
): Promise<ChatRoomResponseDto> => {
  const authHeaders = await getAuthHeaders()

  const response = await client.POST("/inbox/message", {
    body: requestBody,
    headers: authHeaders,
  })

  if (response.error) {
    throw new Error("Sending message failed")
  }

  return response.data
}

//            function: getConversations           //
export const getConversations = async (
  userId: string,
): Promise<ConversationListResponseDto> => {
  const authHeaders = await getAuthHeaders()

  const response = await client.GET("/inbox/conversations/{userId}", {
    params: {
      path: { userId },
    },
    headers: authHeaders,
  })

  if (response.error) {
    throw new Error("Getting conversations failed")
  }

  return response.data
}

//            function: getChatRoomById           //
export const getChatRoomById = async (
  chatRoomId: string,
  userId: string,
): Promise<ChatRoomResponseDto> => {
  const authHeaders = await getAuthHeaders()

  const response = await client.GET("/inbox/chatroom/{chatRoomId}/{userId}", {
    params: {
      path: { chatRoomId, userId },
    },
    headers: authHeaders,
  })

  if (response.error) {
    throw new Error("Getting chat room failed")
  }

  return response.data
}
