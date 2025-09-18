import FirestoreCollections from "../adapters/FirestoreCollections"
import { Order } from "../../business-layer/models/Order"
import { CreateOrderRequest } from "../../service-layer/dtos/request/CreateOrderRequest"
import { UserService } from "./UserRepository"
import { ReagentService } from "./ReagentRepository"
import admin from "firebase-admin"

export class OrderService {
  userService = new UserService()
  reagentService = new ReagentService()
  db = admin.firestore()
  async createOrder(req: CreateOrderRequest): Promise<Order> {
    const user = await this.userService.getUserById(req.req_id)
    const reagent = await this.reagentService.getReagentById(req.reagent_id)
    if (!user || !reagent) throw new Error("No user or reagent found")
    const order: Order = {
      req_id: req.req_id,
      owner_id: reagent.user_id,
      reagent_id: req.reagent_id,
      status: "pending",
      createdAt: new Date(),
      message: req.message,
    }
    const docRef = await FirestoreCollections.orders.add(order)
    const createdOrder = {
      ...order,
      id: docRef.id,
    }

    return createdOrder
  }

  async getAllOrders(user_id: string): Promise<Order[]> {
    const [snap1, snap2] = await Promise.all([
      this.db.collection("orders").where("req_id", "==", user_id).get(),
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

  async getOrderById(id: string): Promise<Order> {
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

  async updateOrderStatus(id: string, status: string): Promise<Order> {
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
