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
} from "tsoa"
import { AuthRequest } from "../../service-layer/dtos/request/AuthRequest"
import { OfferService } from "../../data-layer/repositories/OfferRepository"
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
    const offer = await new OfferService().createOffer(user.uid, req)
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
    const trade = await new OfferService().createTrade(user.uid, req)
    return trade
  }

@SuccessResponse("200", "All offers returned successfully")
  @Security("jwt")
  @Get()
  public async getOffers(
    @Request() request: AuthRequest,
  ): Promise<Offer[]> {
    try {
      const user = request.user
      const user_id = user.uid
      if (user_id) {
        const offers = await new OfferService().getAllOffers(user_id)
        return offers
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
      const offer = await new OfferService().getOfferById(id)
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
}
