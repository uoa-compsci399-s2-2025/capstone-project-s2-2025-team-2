import FirestoreCollections from "../adapters/FirestoreCollections"
import { CreateOfferRequest } from "../../service-layer/dtos/request/CreateOfferRequest"
import { CreateOfferTradeRequest } from "../../service-layer/dtos/request/CreateOfferTradeRequest"
import { CreateOfferExchangeRequest } from "../../service-layer/dtos/request/CreateOfferExchangeRequest"

import { UserService } from "./UserRepository"
import { WantedService } from "./WantedRepository"
import { InboxService } from "../../service-layer/services/InboxService"
import admin from "firebase-admin"
import { Offer, TradeOffer } from "business-layer/models/Offer"

export class OfferService {
  userService = new UserService()
  wantedService = new WantedService()
  inboxService = new InboxService()
  db = admin.firestore()
  async createOffer(
    user_id: string,
    requestBody: CreateOfferRequest,
  ): Promise<Offer> {
    const user = await this.userService.getUserById(user_id)
    const wanted = await this.wantedService.getWantedReagentById(
      requestBody.reagent_id,
    )
    if (!user || !wanted) throw new Error("No user or reagent found")

    const offer: Offer = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      owner_id: wanted.user_id,
      status: "pending",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
      offeredReagentId: requestBody.offeredReagentId,
    }
    console.log("Order: ", offer)
    const docRef = await FirestoreCollections.offers.add(offer)
    const createdOffer = {
      ...offer,
      id: docRef.id,
    }
    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: wanted.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdOffer
  }

  async createTrade(
    user_id: string,
    requestBody: CreateOfferTradeRequest,
  ): Promise<TradeOffer> {
    const user = await this.userService.getUserById(user_id)
    const wanted = await this.wantedService.getWantedReagentById(
      requestBody.reagent_id,
    )
    if (!user || !wanted) throw new Error("No user or reagent found")

    const offer: TradeOffer = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      owner_id: wanted.user_id,
      status: "pending",
      createdAt: new Date(),
      offeredReagentId: requestBody.offeredReagentId,
      ...(requestBody.message && { message: requestBody.message }),
      price: requestBody.price,
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
    }
    console.log("Order: ", offer)
    const docRef = await FirestoreCollections.offers.add(offer)
    const createdOffer = {
      ...offer,
      id: docRef.id,
    }
    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: wanted.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdOffer
  }
  async createExchange(
    user_id: string,
    requestBody: CreateOfferExchangeRequest,
  ): Promise<Offer> {
    const user = await this.userService.getUserById(user_id)
    const wanted = await this.wantedService.getWantedReagentById(
      requestBody.reagent_id,
    )
    if (!user || !wanted) throw new Error("No user or reagent found")

    const offer: Offer = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      owner_id: wanted.user_id,
      status: "pending",
      createdAt: new Date(),
      offeredReagentId: requestBody.offeredReagentId,
      ...(requestBody.message && { message: requestBody.message }),
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
    }
    console.log("Order: ", offer)
    const docRef = await FirestoreCollections.offers.add(offer)
    const createdOffer = {
      ...offer,
      id: docRef.id,
    }
    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: wanted.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdOffer
  }

  async getAllOffers(user_id: string): Promise<Offer[] | TradeOffer[]> {
    const [snap1, snap2] = await Promise.all([
      this.db.collection("offers").where("requester_id", "==", user_id).get(),
      this.db.collection("offers").where("owner_id", "==", user_id).get(),
    ])

    return [
      ...snap1.docs.map((d) => {
        const data = d.data() as Omit<Offer, "id">
        return { id: d.id, ...data }
      }),
      ...snap2.docs.map((d) => {
        const data = d.data() as Omit<Offer, "id">
        return { id: d.id, ...data }
      }),
    ]
  }

  async getOfferById(id: string): Promise<Offer | TradeOffer> {
    try {
      const offerDoc = await FirestoreCollections.offers.doc(id).get()

      if (!offerDoc.exists) {
        throw new Error(`Offer with id - ${id} not found`)
      }
      return {
        ...offerDoc.data(),
      } as Offer
    } catch (err) {
      throw new Error(`Failed to get offer: ${(err as Error).message}`)
    }
  }
}
