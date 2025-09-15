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
  }
}
