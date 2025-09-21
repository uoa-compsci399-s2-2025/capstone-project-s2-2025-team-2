import { Body, Controller, Get, Post, Route, Tags, Path } from "tsoa";
import { InboxService } from "../../service-layer/services/InboxService";
import { CreateChatRoomRequest } from "../../service-layer/dtos/request/CreateChatRoomRequest";
import { SendMessageRequest } from "../../service-layer/dtos/request/SendMessageRequest";
import { ChatRoomResponse, ConversationListResponse } from "../../service-layer/dtos/response/ChatRoomResponse";

@Route("inbox")
@Tags("Inbox")
export class InboxController extends Controller {
  private inboxService = new InboxService();

  @Post("chatroom")
  async createChatRoom(@Body() request: CreateChatRoomRequest): Promise<ChatRoomResponse> {
    if (!request.user1_id || !request.user2_id) {
      this.setStatus(400);
      throw new Error("user1_id and user2_id are required");
    }

    try {
      const chatRoom = await this.inboxService.createChatRoom(request);
      const chatRoomResponse = await this.inboxService.getChatRoomById(chatRoom.id!, request.user1_id);
      this.setStatus(201);
      return chatRoomResponse;
    } catch (error) {
      console.error("Error creating chat room:", error);
      this.setStatus(500);
      throw new Error("Internal server error");
    }
  }

  @Post("message")
  async sendMessage(@Body() request: SendMessageRequest): Promise<ChatRoomResponse> {
    if (!request.chat_room_id || !request.sender_id || !request.content) {
      this.setStatus(400);
      throw new Error("chat_room_id, sender_id, and content are required");
    }

    try {
      await this.inboxService.sendMessage(request);
      const chatRoom = await this.inboxService.getChatRoomById(request.chat_room_id, request.sender_id);
      this.setStatus(201);
      return chatRoom;
    } catch (error) {
      console.error("Error sending message:", error);
      this.setStatus(500);
      throw new Error("Internal server error");
    }
  }

  @Get("conversations/{userId}")
  async getConversations(@Path() userId: string): Promise<ConversationListResponse> {
    if (!userId) {
      this.setStatus(400);
      throw new Error("userId is required");
    }

    try {
      const conversations = await this.inboxService.getConversations(userId);
      this.setStatus(200);
      return conversations;
    } catch (error) {
      console.error("Error getting conversations:", error);
      this.setStatus(500);
      throw new Error("Internal server error");
    }
  }

  @Get("chatroom/{chatRoomId}/{userId}")
  async getChatRoomById(@Path() chatRoomId: string, @Path() userId: string): Promise<ChatRoomResponse> {
    if (!chatRoomId || !userId) {
      this.setStatus(400);
      throw new Error("chatRoomId and userId are required");
    }

    try {
      const chatRoom = await this.inboxService.getChatRoomById(chatRoomId, userId);
      
      if (!chatRoom) {
        this.setStatus(404);
        throw new Error("Chat room not found");
      }
      
      this.setStatus(200);
      return chatRoom;
    } catch (error) {
      console.error("Error getting chat room:", error);
      if (error instanceof Error && error.message.includes("not authorized")) {
        this.setStatus(403);
        throw new Error("User is not authorized to access this chat room");
      }
      this.setStatus(500);
      throw new Error("Internal server error");
    }
  }
}
