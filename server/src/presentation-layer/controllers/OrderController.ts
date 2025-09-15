import { Order } from "../../business-layer/models/Order"
import { CreateOrderRequest } from "../../service-layer/dtos/request/CreateOrderRequest"
import {
  Controller,
  Get,
  Post,
  Route,
  SuccessResponse,
  Security,
  Request,
  Body,
  Tags,
} from "tsoa"
import { AuthRequest } from "../../service-layer/dtos/request/AuthRequest"
import { OrderService } from "../../data-layer/repositories/OrderRepository"

@Tags("Order")
@Route("orders")
export class OrderController extends Controller {
  @SuccessResponse("201", "Order created successfully")
  @Security("jwt")
  @Post()
  public async createOrder(
    @Body() req: CreateOrderRequest,
    @Request() request: AuthRequest,
  ): Promise<Order> {
    const user = request.user
    const reqWithUser = { ...req, req_id: user.uid }
    const order = await new OrderService().createOrder(reqWithUser)
    return order
  }

  @SuccessResponse("200", "All reagents returned successfully")
  @Security("jwt")
  @Get()
  public async getOrders(@Request() request: AuthRequest): Promise<Order[]> {
    try {
      const user = request.user
      const user_id = user.uid
      if (user_id) {
        const orders = await new OrderService().getAllOrders(user_id)
        return orders
      }
      return []
    } catch (err) {
      throw new Error("Failed to fetch orders: " + (err as Error).message)
    }
  }

}
