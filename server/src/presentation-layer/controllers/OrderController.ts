import { Order } from "../../business-layer/models/Order"
import { Trade } from "../../business-layer/models/Order"
import { Exchange } from "../../business-layer/models/Order"
import { CreateOrderRequest } from "../../service-layer/dtos/request/CreateOrderRequest"
import { CreateTradeRequest } from "../../service-layer/dtos/request/CreateTradeRequest"
import { CreateExchangeRequest } from "../../service-layer/dtos/request/CreateExchangeRequest"
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
    @Body()
    req: CreateOrderRequest,
    @Request() request: AuthRequest,
  ): Promise<Order> {
    const user = request.user
    console.log("User: ", user)
    const order = await new OrderService().createOrder(user.uid, req)
    return order
  }

  @SuccessResponse("201", "Trade created successfully")
  @Security("jwt")
  @Post("trades")
  public async createTrade(
    @Body()
    req: CreateTradeRequest,
    @Request() request: AuthRequest,
  ): Promise<Trade> {
    const user = request.user
    console.log("User: ", user)
    const trade = await new OrderService().createTrade(user.uid, req)
    return trade
  }

  @SuccessResponse("201", "Exchange created successfully")
  @Security("jwt")
  @Post("exchanges")
  public async createExchange(
    @Body()
    req: CreateExchangeRequest,
    @Request() request: AuthRequest,
  ): Promise<Exchange> {
    const user = request.user
    console.log("User: ", user)
    const reagent = await new OrderService().reagentService.getReagentById(
      req.offeredReagentId,
    )
    if (reagent?.user_id !== user.uid) {
      this.setStatus(403)
      throw new Error("You can only offer your own reagents for exchange")
    }
    const exchange = await new OrderService().createExchange(user.uid, req)
    return exchange
  }

  @SuccessResponse("200", "All orders returned successfully")
  @Security("jwt")
  @Get()
  public async getOrders(
    @Request() request: AuthRequest,
  ): Promise<Order[] | Trade[] | Exchange[]> {
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

  @SuccessResponse("200", "All orders returned successfully")
  @Security("jwt")
  @Get("{id}")
  public async getOrderById(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order | Trade | Exchange> {
    try {
      const user = request.user
      const order = await new OrderService().getOrderById(id)
      if (!order) {
        this.setStatus(404)
        console.error("Order not found")
      }
      if (user.uid !== order.requester_id && user.uid !== order.owner_id) {
        this.setStatus(403)
        console.error("Unauthorized to retrieve this order")
      }
      return order
    } catch (err) {
      throw new Error("Failed to fetch order: " + (err as Error).message)
    }
  }

  @SuccessResponse("200", "order successfully approved")
  @Security("jwt")
  @Patch("{id}/approve")
  public async approveOrder(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order | Trade | Exchange> {
    const user = request.user
    const order = await new OrderService().getOrderById(id)
    if (!order) {
      this.setStatus(404)
      console.error("Order not found")
    }
    //only owner can approve
    if (user.uid !== order.owner_id) {
      this.setStatus(403)
      console.error("Unauthorized to approve this order request")
    }
    const updatedOrder = await new OrderService().approveOrder(id)
    return updatedOrder
  }

  @SuccessResponse("200", "order successfully canceld")
  @Security("jwt")
  @Patch("{id}/cancel")
  public async cancelOrder(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order | Trade | Exchange> {
    const user = request.user
    const order = await new OrderService().getOrderById(id)
    if (!order) {
      this.setStatus(404)
      throw new Error("Order not found")
    }
    //only owner or requester can cancel
    if (user.uid !== order.requester_id && user.uid !== order.owner_id) {
      this.setStatus(403)
      throw new Error("Unauthorized to cancel this order request")
    }
    const updatedOrder = await new OrderService().updateOrderStatus(
      id,
      "canceled",
    )
    return updatedOrder
  }
}
