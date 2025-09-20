import { Request, Response } from "express";
import { InboxService } from "../../service-layer/services/InboxService";
import { CreateChatRoomRequest } from "../../service-layer/dtos/request/CreateChatRoomRequest";
import { SendMessageRequest } from "../../service-layer/dtos/request/SendMessageRequest";
import { ResponseDto } from "../../service-layer/dtos/response/ResponseDto"

export class InboxController {
  private inboxService = new InboxService();

  async createChatRoom(req: Request, res: Response): Promise<void> {
    try {
      const request: CreateChatRoomRequest = req.body;
      
      if (!request.user1_id || !request.user2_id) {
        res.status(400).json({
          success: false,
          message: "user1_id and user2_id are required",
        } as ResponseDto);
        return;
      }

      const chatRoom = await this.inboxService.createChatRoom(request);
      
      res.status(201).json({
        success: true,
        message: "Chat room created successfully",
        data: chatRoom,
      } as ResponseDto);
    } catch (error) {
      console.error("Error creating chat room:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      } as ResponseDto);
    }
  }

  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const request: SendMessageRequest = req.body;
      
      if (!request.chat_room_id || !request.sender_id || !request.content) {
        res.status(400).json({
          success: false,
          message: "chat_room_id, sender_id, and content are required",
        } as ResponseDto);
        return;
      }

      const message = await this.inboxService.sendMessage(request);
      
      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: message,
      } as ResponseDto);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      } as ResponseDto);
    }
  }

  async getConversations(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId || req.body.userId;
      
      if (!userId) {
        res.status(400).json({
          success: false,
          message: "userId is required",
        } as ResponseDto);
        return;
      }

      const conversations = await this.inboxService.getConversations(userId);
      
      res.status(200).json({
        success: true,
        message: "Conversations retrieved successfully",
        data: conversations,
      } as ResponseDto);
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      } as ResponseDto);
    }
  }

  async getChatRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { chatRoomId } = req.params;
      const userId = req.params.userId || req.body.userId;
      
      if (!chatRoomId || !userId) {
        res.status(400).json({
          success: false,
          message: "chatRoomId and userId are required",
        } as ResponseDto);
        return;
      }

      const chatRoom = await this.inboxService.getChatRoomById(chatRoomId, userId);
      
      if (!chatRoom) {
        res.status(404).json({
          success: false,
          message: "Chat room not found",
        } as ResponseDto);
        return;
      }
      
      res.status(200).json({
        success: true,
        message: "Chat room retrieved successfully",
        data: chatRoom,
      } as ResponseDto);
    } catch (error) {
      console.error("Error getting chat room:", error);
      if (error instanceof Error && error.message.includes("not authorized")) {
        res.status(403).json({
          success: false,
          message: "User is not authorized to access this chat room",
        } as ResponseDto);
        return;
      }
      res.status(500).json({
        success: false,
        message: "Internal server error",
      } as ResponseDto);
    }
  }
}
