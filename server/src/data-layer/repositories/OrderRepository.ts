import FirestoreCollections from "../adapters/FirestoreCollections"
import { Order } from "../../business-layer/models/Order"
import { CreateOrderRequest } from "../../service-layer/dtos/request/CreateOrderRequest"
import { UserService } from "./UserRepository"
import { ReagentService } from "./ReagentRepository"

export class OrderService {
  userService = new UserService()
  reagentService = new ReagentService()
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
    }
    const docRef = await FirestoreCollections.orders.add(order)
    const createdOrder = {
      ...order,
      id: docRef.id,
    }

    return createdOrder
  }
}
