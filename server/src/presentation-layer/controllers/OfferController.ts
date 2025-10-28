import { Order } from "../../business-layer/models/Order"
import { Trade } from "../../business-layer/models/Order"
import { Exchange } from "../../business-layer/models/Order"
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
  Path,
  Patch,
} from "tsoa"
import { AuthRequest } from "../../service-layer/dtos/request/AuthRequest"
import { OrderService } from "../../data-layer/repositories/OrderRepository"
import { CreateOfferRequest } from "service-layer/dtos/request/CreateOfferRequest"
import { Offer, TradeOffer } from "business-layer/models/Offer"
import { CreateOfferTradeRequest } from "service-layer/dtos/request/CreateOfferTradeRequest"

@Tags("Offers")
@Route("offers")
export class OfferController extends Controller {
  @SuccessResponse("201", "Offer created successfully")
  @Security("jwt")
  @Post()
  public async createOffer(
    @Body()
    req: CreateOfferRequest,
    @Request() request: AuthRequest,
  ): Promise<Offer> {
    const user = request.user
    console.log("User: ", user)
    const offer = await new OrderService().createOffer(user.uid, req)
    return offer
  }

  @SuccessResponse("201", "Trade created successfully")
  @Security("jwt")
  @Post("trades")
  public async createTrade(
    @Body()
    req: CreateOfferTradeRequest,
    @Request() request: AuthRequest,
  ): Promise<TradeOffer> {
    const user = request.user
    console.log("User: ", user)
    const trade = await new OrderService().createOfferTrade(user.uid, req)
    return trade
  }

  @SuccessResponse("200", "All offers returned successfully")
  @Security("jwt")
  @Get()
  public async getOffers(@Request() request: AuthRequest): Promise<Offer[]> {
    try {
      const user = request.user
      const user_id = user.uid
      if (user_id) {
        const offers = await new OrderService().getAllTransactions(
          user_id,
          "offers",
        )
        // Filter only objects that are of type Offer (have 'offeredReagentId' property)
        return offers.filter(
          (offer: any): offer is Offer =>
            offer && typeof offer.offeredReagentId !== "undefined",
        )
      }
      return []
    } catch (err) {
      throw new Error("Failed to fetch offers: " + (err as Error).message)
    }
  }

  @SuccessResponse("200", "All offers returned successfully")
  @Security("jwt")
  @Get("{id}")
  public async getOfferById(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order | Trade | Exchange> {
    try {
      const user = request.user
      const offer = await new OrderService().getTransactionById(id, "offers")
      if (!offer) {
        this.setStatus(404)
        console.error("Offer not found")
      }
      if (user.uid !== offer.requester_id) {
        this.setStatus(403)
        console.error("Unauthorized to retrieve this offer")
      }
      return offer
    } catch (err) {
      throw new Error("Failed to fetch offer: " + (err as Error).message)
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
    const order = await new OrderService().getTransactionById(id, "offers")

    if (!order) {
      this.setStatus(404)
      throw new Error("Order not found")
    }

    if (user.uid !== order.owner_id) {
      this.setStatus(403)
      throw new Error("Unauthorized to approve this order request")
    }

    const updatedOrder = await new OrderService().approveOffer(id)
    return updatedOrder
  }

  @SuccessResponse("200", "order successfully canceled")
  @Security("jwt")
  @Patch("{id}/cancel")
  public async cancelOrder(
    @Path() id: string,
    @Request() request: AuthRequest,
  ): Promise<Order | Trade | Exchange> {
    const user = request.user
    const order = await new OrderService().getTransactionById(id, "offers")
    if (!order) {
      this.setStatus(404)
      throw new Error("Order not found")
    }
    //only owner or requester can cancel
    if (user.uid !== order.requester_id && user.uid !== order.owner_id) {
      this.setStatus(403)
      throw new Error("Unauthorized to cancel this order request")
    }
    const updatedOrder = await new OrderService().updateTransactionStatus(
      id,
      "canceled",
      "offers",
    )
    return updatedOrder
  }
}
