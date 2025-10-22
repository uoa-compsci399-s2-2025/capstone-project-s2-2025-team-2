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

    async updateOfferStatus(
    id: string,
    status: string,
  ): Promise<Offer | TradeOffer> {
    try {
      const offerRef = await FirestoreCollections.offers.doc(id)
      await offerRef.update({
        status: status,
      })
      return await this.getOfferById(id)
    } catch (err) {
      throw new Error(
        `Failed to update order status: ${(err as Error).message}`,
      )
    }
  }

  async approveOffer(id: string): Promise<Offer> {
    return await this.db.runTransaction(async (tx) => {
      const offerRef = FirestoreCollections.offers.doc(id)
      const offerDoc = await tx.get(offerRef)
      if (!offerDoc.exists) {
        throw new Error(`Offer ${id} not found`)
      }
      const offer = offerDoc.data() as Offer

      //read pending offers for requested reagent
      const otherOffersQuery = this.db
        .collection("offers")
        .where("reagent_id", "==", offer.reagent_id)
        .where("status", "==", "pending")
      const otherOffers = await tx.get(otherOffersQuery)

      //read pending offers for offered reagent
      let otherOfferedOffers: FirebaseFirestore.QuerySnapshot | null = null
      if ("offeredReagentId" in (offer as any)) {
        const exchange = offer as Offer
        const otherOfferedOffersQuery = this.db
          .collection("offers")
          .where("reagent_id", "==", exchange.offeredReagentId)
          .where("status", "==", "pending")
        otherOfferedOffers = await tx.get(otherOfferedOffersQuery)
      }

      //update offer status
      tx.update(offerRef, { status: "approved" })

      //handle trade
      if ("offeredReagentId" in (offer as any)) {
        const exchange = offer as Offer

        //fetch requesterOfferedReagentId
        const wantedDoc = await this.db
          .collection("wanted")
          .doc(exchange.reagent_id)
          .get();
        const wantedData = wantedDoc.data() as any;
        const requesterOfferedReagentId = wantedData.requesterOfferedReagentId;
        
        //transfer requester's offered reagent to the offerer, set to private
        const requestedReagentRef = this.db
          .collection("reagents")
          .doc(requesterOfferedReagentId);
        tx.update(requestedReagentRef, {
          user_id: exchange.requester_id,
          visibility: "private",
        });

        //transfer wanted reagent to the requester, set to private
        const offeredReagentRef = this.db
          .collection("reagents")
          .doc(exchange.offeredReagentId)
        tx.update(offeredReagentRef, {
          user_id: offer.owner_id,
          visibility: "private",
        })

        //cancel pending offers for offered reagent
        if (otherOfferedOffers) {
          otherOfferedOffers.docs.forEach((doc) => {
            if (doc.id !== id) {
              tx.update(doc.ref, { status: "canceled" })
            }
          })
        }
      } else {
        //one way transfer for sell/trade, set to private
        const reagentRef = this.db.collection("reagents").doc(offer.offeredReagentId)
        tx.update(reagentRef, {
          user_id: offer.owner_id,
          visibility: "private",
        })
      }

      //cancel pending offers for requested reagent
      otherOffers.docs.forEach((doc) => {
        if (doc.id !== id) {
          tx.update(doc.ref, { status: "canceled" })
        }
      })

      return { ...offer, status: "approved" }
    })
  }
}
