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
  Patch,
  Path,
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

  @SuccessResponse("200", "All orders returned successfully")
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

  @SuccessResponse("200", "order successfully approved")
  @Security("jwt")
  @Patch("{id}/approve")
  public async approveOrder(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order> {
    const user = request.user
    const order = new OrderService().getOrderById(id)
    if (!order) {
      this.setStatus(404)
      throw new Error("Order not found")
    }
    if (
      user.uid !== (await order).owner_id &&
      user.uid !== (await order).req_id
    ) {
      this.setStatus(403)
      throw new Error("Unauthorized to approve this order request")
    }
    const updatedOrder = await new OrderService().updateOrderStatus(
      id,
      "approved",
    )
    return updatedOrder
  }

  @SuccessResponse("200", "order successfully canceld")
  @Security("jwt")
  @Patch("{id}/cancel")
  public async cancelOrder(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order> {
    const user = request.user
    const order = new OrderService().getOrderById(id)
    if (!order) {
      this.setStatus(404)
      throw new Error("Order not found")
    }
    if (
      user.uid !== (await order).owner_id &&
      user.uid !== (await order).req_id
    ) {
      this.setStatus(403)
      throw new Error("Unauthorized to approve this order request")
    }
    const updatedOrder = await new OrderService().updateOrderStatus(
      id,
      "canceled",
    )
    return updatedOrder
  }
}
