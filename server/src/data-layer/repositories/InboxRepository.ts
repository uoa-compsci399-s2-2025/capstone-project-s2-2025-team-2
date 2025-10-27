import FirestoreCollections from "../adapters/FirestoreCollections"
import { ChatRoom, Message } from "../../business-layer/models/ChatRoom"

export class InboxRepository {
  private db = FirestoreCollections

  async createChatRoom(chatRoom: ChatRoom): Promise<ChatRoom> {
    console.log("InboxRepository: About to save to Firestore:", chatRoom)
    const docRef = await this.db.chatRooms.add(chatRoom)
    console.log("InboxRepository: Saved to Firestore with ID:", docRef.id)

    const result = {
      ...chatRoom,
      id: docRef.id,
    }
    console.log("InboxRepository: Returning:", result)
    return result
  }

  async getChatRoomById(chatRoomId: string): Promise<ChatRoom | null> {
    const doc = await this.db.chatRooms.doc(chatRoomId).get()
    if (!doc.exists) {
      return null
    }
    return {
      id: doc.id,
      ...doc.data(),
    } as ChatRoom
  }

  async getChatRoomByUsers(
    user1Id: string,
    user2Id: string,
    reagentId?: string,
  ): Promise<ChatRoom | null> {
    let query = this.db.chatRooms
      .where("user1_id", "in", [user1Id, user2Id])
      .where("user2_id", "in", [user1Id, user2Id])

    if (reagentId) {
      query = query.where("reagent_id", "==", reagentId)
    }

    const snapshot = await query.get()

    if (snapshot.empty) {
      return null
    }

    const doc = snapshot.docs[0]
    return {
      id: doc.id,
      ...doc.data(),
    } as ChatRoom
  }

  async getUserChatRooms(userId: string): Promise<ChatRoom[]> {
    // user1_id == userId
    const q1 = await this.db.chatRooms.where("user1_id", "==", userId).get()
    // user2_id == userId
    const q2 = await this.db.chatRooms.where("user2_id", "==", userId).get()

    const results: ChatRoom[] = [...q1.docs, ...q2.docs].map((doc) => ({
      id: doc.id,
      ...(doc.data() as ChatRoom),
    }))

    return results
  }

  async createMessage(message: Message): Promise<Message> {
    const docRef = await this.db.messages.add(message)
    return {
      ...message,
      id: docRef.id,
    }
  }

  async getMessagesByChatRoom(chatRoomId: string): Promise<Message[]> {
    const query = this.db.messages.where("chat_room_id", "==", chatRoomId)

    const snapshot = await query.get()

    console.log("snapshot..")
    console.log(snapshot.docs)

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        // Handle Firestore Timestamp objects
        const aTime = (a.created_at as any)._seconds
          ? (a.created_at as any)._seconds * 1000
          : new Date(a.created_at).getTime()
        const bTime = (b.created_at as any)._seconds
          ? (b.created_at as any)._seconds * 1000
          : new Date(b.created_at).getTime()

        return aTime - bTime
      }) as Message[]
  }

  async getMessagesByChatRoomWithLimit(
    chatRoomId: string,
    limit: number = 50,
  ): Promise<Message[]> {
    const query = this.db.messages
      .where("chat_room_id", "==", chatRoomId)
      .limit(limit)

    const snapshot = await query.get()

    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .sort((a, b) => {
        // Handle Firestore Timestamp objects
        const aTime = (a.created_at as any)._seconds
          ? (a.created_at as any)._seconds * 1000
          : new Date(a.created_at).getTime()
        const bTime = (b.created_at as any)._seconds
          ? (b.created_at as any)._seconds * 1000
          : new Date(b.created_at).getTime()

        return aTime - bTime // Oldest first for chat room
      }) as Message[]
  }
}
