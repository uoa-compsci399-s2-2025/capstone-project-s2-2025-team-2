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
      owner_id: reagent.user_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
    }

    console.log("Order: ", order)
    console.log("2")

    const docRef = await FirestoreCollections.orders.add(order)
    const createdOrder = {
      ...order,
      id: docRef.id,
    }

    // Create chat room between requester and reagent owner
    try {
      console.log("Creating chat room for order with data:", {
        user1_id: user_id,
        user2_id: reagent.user_id,
        reagent_id: requestBody.reagent_id,
        initial_message: requestBody.message,
      })

      const chatRoom = await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: reagent.user_id,
        reagent_id: requestBody.reagent_id,
        initial_message: requestBody.message,
      })

      console.log("Chat room created successfully:", chatRoom)
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
      owner_id: reagent.user_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      price: requestBody.price,
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
    }

    console.log("Order: ", order)
    console.log("1")

    const docRef = await FirestoreCollections.orders.add(order)
    const createdTrade = {
      ...order,
      id: docRef.id,
    }

    // Create chat room between requester and reagent owner
    try {
      console.log("Creating chat room for trade with data:", {
        user1_id: user_id,
        user2_id: reagent.user_id,
        reagent_id: requestBody.reagent_id,
        initial_message: requestBody.message,
      })

      const chatRoom = await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: reagent.user_id,
        reagent_id: requestBody.reagent_id,
        initial_message: requestBody.message,
      })

      console.log("Chat room created successfully for trade:", chatRoom)
    } catch (error) {
      console.error("Error creating chat room for trade:", error)
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
    if (requestBody.offeredReagentId === requestBody.reagent_id) {
      throw new Error("Cannot exchange the same reagent")
    }
    const order: Exchange = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      owner_id: reagent.user_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      offeredReagentId: requestBody.offeredReagentId,
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
    }

    console.log("Order: ", order)
    console.log("3")

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
        reagent_id: requestBody.reagent_id,
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

  async approveOrder(id: string): Promise<Order> {
    return await this.db.runTransaction(async (tx) => {
      const orderRef = FirestoreCollections.orders.doc(id)
      const orderDoc = await tx.get(orderRef)
      if (!orderDoc.exists) {
        throw new Error(`Order ${id} not found`)
      }
      const order = orderDoc.data() as Order

      //read pending orders for requested reagent
      const otherOrdersQuery = this.db
        .collection("orders")
        .where("reagent_id", "==", order.reagent_id)
        .where("status", "==", "pending")
      const otherOrders = await tx.get(otherOrdersQuery)

      //read pending orders for offered reagent
      let otherOfferedOrders: FirebaseFirestore.QuerySnapshot | null = null
      if ("offeredReagentId" in (order as any)) {
        const exchange = order as Exchange
        const otherOfferedOrdersQuery = this.db
          .collection("orders")
          .where("reagent_id", "==", exchange.offeredReagentId)
          .where("status", "==", "pending")
        otherOfferedOrders = await tx.get(otherOfferedOrdersQuery)
      }

      //update order status
      tx.update(orderRef, { status: "approved" })

      //handle trade based on order type
      if ("offeredReagentId" in (order as any)) {
        const exchange = order as Exchange

        //transfer requested reagent, set to private
        const requestedReagentRef = this.db
          .collection("reagents")
          .doc(order.reagent_id)
        tx.update(requestedReagentRef, {
          user_id: order.requester_id,
          visibility: "private",
        })

        //transfer offered reagent, set to private
        const offeredReagentRef = this.db
          .collection("reagents")
          .doc(exchange.offeredReagentId)
        tx.update(offeredReagentRef, {
          user_id: order.owner_id,
          visibility: "private",
        })

        //cancel pending orders for offered reagent
        if (otherOfferedOrders) {
          otherOfferedOrders.docs.forEach((doc) => {
            if (doc.id !== id) {
              tx.update(doc.ref, { status: "canceled" })
            }
          })
        }
      } else {
        //one way transfer for sell/trade, set to private
        const reagentRef = this.db.collection("reagents").doc(order.reagent_id)
        tx.update(reagentRef, {
          user_id: order.requester_id,
          visibility: "private",
        })
      }

      //cancel pending orders for requested reagent
      otherOrders.docs.forEach((doc) => {
        if (doc.id !== id) {
          tx.update(doc.ref, { status: "canceled" })
        }
      })

      return { ...order, status: "approved" }
    })
  }
}
