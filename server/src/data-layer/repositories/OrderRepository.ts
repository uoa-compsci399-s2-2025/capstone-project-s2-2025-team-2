import FirestoreCollections from "../adapters/FirestoreCollections"
import { Order } from "../../business-layer/models/Order"
import { Trade } from "../../business-layer/models/Order"
import { Exchange } from "../../business-layer/models/Order"
import { CreateOrderRequest } from "../../service-layer/dtos/request/CreateOrderRequest"
import { CreateTradeRequest } from "../../service-layer/dtos/request/CreateTradeRequest"
import { CreateExchangeRequest } from "../../service-layer/dtos/request/CreateExchangeRequest"
import { UserService } from "./UserRepository"
import { ReagentService } from "./ReagentRepository"
import { InboxService } from "../../service-layer/services/InboxService"
import admin from "firebase-admin"

export class OrderService {
  userService = new UserService()
  reagentService = new ReagentService()
  inboxService = new InboxService()
  db = admin.firestore()
  async createOrder(
    user_id: string,
    requestBody: CreateOrderRequest,
  ): Promise<Order> {
    const user = await this.userService.getUserById(user_id)
    const reagent = await this.reagentService.getReagentById(
      requestBody.reagent_id,
    )
    if (!user || !reagent) throw new Error("No user or reagent found")
    const order: Order = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
    }

    console.log("Order: ", order)

    const docRef = await FirestoreCollections.orders.add(order)
    const createdOrder = {
      ...order,
      id: docRef.id,
    }

    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: reagent.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdOrder
  }

  async createTrade(
    user_id: string,
    requestBody: CreateTradeRequest,
  ): Promise<Trade> {
    const user = await this.userService.getUserById(user_id)
    const reagent = await this.reagentService.getReagentById(
      requestBody.reagent_id,
    )
    if (!user || !reagent) throw new Error("No user or reagent found")
    const order: Trade = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      price: requestBody.price,
    }

    console.log("Order: ", order)

    const docRef = await FirestoreCollections.orders.add(order)
    const createdTrade = {
      ...order,
      id: docRef.id,
    }

    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: reagent.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdTrade
  }

  async createExchange(
    user_id: string,
    requestBody: CreateExchangeRequest,
  ): Promise<Exchange> {
    const user = await this.userService.getUserById(user_id)
    const reagent = await this.reagentService.getReagentById(
      requestBody.reagent_id,
    )
    if (!user || !reagent) throw new Error("No user or reagent found")
    const order: Exchange = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      offeredReagentId: requestBody.offeredReagentId,
      quantity: requestBody.quantity,
    }

    console.log("Order: ", order)

    const docRef = await FirestoreCollections.orders.add(order)
    const createdExchange = {
      ...order,
      id: docRef.id,
    }

    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: reagent.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdExchange
  }

  async getAllOrders(user_id: string): Promise<Order[] | Trade[] | Exchange[]> {
    const [snap1, snap2] = await Promise.all([
      this.db.collection("orders").where("requester_id", "==", user_id).get(),
      this.db.collection("orders").where("owner_id", "==", user_id).get(),
    ])

    return [
      ...snap1.docs.map((d) => {
        const data = d.data() as Omit<Order, "id">
        return { id: d.id, ...data }
      }),
      ...snap2.docs.map((d) => {
        const data = d.data() as Omit<Order, "id">
        return { id: d.id, ...data }
      }),
    ]
  }

  async getOrderById(id: string): Promise<Order | Trade | Exchange> {
    try {
      const orderDoc = await FirestoreCollections.orders.doc(id).get()

      if (!orderDoc.exists) {
        throw new Error(`Order with id - ${id} not found`)
      }
      return {
        ...orderDoc.data(),
      } as Order
    } catch (err) {
      throw new Error(`Failed to get order: ${(err as Error).message}`)
    }
  }

  async updateOrderStatus(
    id: string,
    status: string,
  ): Promise<Order | Trade | Exchange> {
    try {
      const orderRef = await FirestoreCollections.orders.doc(id)
      await orderRef.update({
        status: status,
      })
      return await this.getOrderById(id)
    } catch (err) {
      throw new Error(
        `Failed to update order status: ${(err as Error).message}`,
      )
    }
  }
}
