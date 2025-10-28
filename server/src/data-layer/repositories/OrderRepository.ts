import FirestoreCollections from "../adapters/FirestoreCollections"
import { Order } from "../../business-layer/models/Order"
import { Trade } from "../../business-layer/models/Order"
import { Exchange } from "../../business-layer/models/Order"
import { OrderWithReagent } from "../../business-layer/models/Order"
import { CreateOrderRequest } from "../../service-layer/dtos/request/CreateOrderRequest"
import { CreateTradeRequest } from "../../service-layer/dtos/request/CreateTradeRequest"
import { CreateExchangeRequest } from "../../service-layer/dtos/request/CreateExchangeRequest"
import { UserService } from "./UserRepository"
import { ReagentService } from "./ReagentRepository"
import { InboxService } from "../../service-layer/services/InboxService"
import admin from "firebase-admin"
import { Offer, TradeOffer } from "business-layer/models/Offer"
import { CreateOfferRequest } from "../../service-layer/dtos/request/CreateOfferRequest"
import { CreateOfferTradeRequest } from "../../service-layer/dtos/request/CreateOfferTradeRequest"
import { CreateOfferExchangeRequest } from "../../service-layer/dtos/request/CreateOfferExchangeRequest"

interface CreateTransactionRequest {
  reagent_id: string
  message?: string
  quantity?: number
  unit?: string
  type: "order" | "trade" | "exchange"
  price?: number
  offeredReagentId?: string
}

export class OrderService {
  userService = new UserService()
  reagentService = new ReagentService()
  inboxService = new InboxService()

  db = admin.firestore()
  async createTransaction(
    user_id: string,
    requestBody: CreateTransactionRequest,
    transactionType: "order" | "offer",
  ): Promise<Order | Trade | Exchange | Offer | TradeOffer> {
    const user = await this.userService.getUserById(user_id)

    //get reagent or wanted based on order type
    const reagent =
      transactionType === "order"
        ? await this.reagentService.getReagentById(requestBody.reagent_id)
        : await this.reagentService.getReagentById(
            requestBody.reagent_id,
            "wanted",
          )

    if (!user || !reagent) throw new Error("No user or reagent found")

    if (
      requestBody.type === "exchange" &&
      requestBody.offeredReagentId === requestBody.reagent_id
    ) {
      throw new Error("Cannot exchange the same reagent")
    }

    const transaction = {
      requester_id: user_id,
      reagent_id: requestBody.reagent_id,
      owner_id: reagent.user_id,
      status: "pending" as "pending" | "approved" | "canceled",
      createdAt: new Date(),
      ...(requestBody.message && { message: requestBody.message }),
      ...(requestBody.quantity && { quantity: requestBody.quantity }),
      ...(requestBody.unit && { unit: requestBody.unit }),
      ...(requestBody.price !== undefined && { price: requestBody.price }),
      ...(requestBody.offeredReagentId && {
        offeredReagentId: requestBody.offeredReagentId,
      }),
    }

    console.log("Order/Offer: ", transaction)
    // Order or Offer creation depends on transactionType
    const collection = transactionType === "order" ? "orders" : "offers"
    const docRef = await FirestoreCollections[collection].add(transaction)
    const createdTransaction = {
      ...transaction,
      id: docRef.id,
    }

    // Create chat room between requester and reagent owner
    try {
      await this.inboxService.createChatRoom({
        user1_id: user_id,
        user2_id: reagent.user_id,
        initial_message: requestBody.message,
      })
    } catch (error) {
      console.error("Error creating chat room for order:", error)
      // Don't fail the order creation if chat room creation fails
    }

    return createdTransaction
  }

  async createOrder(
    userId: string,
    request: CreateOrderRequest,
  ): Promise<Order> {
    return this.createTransaction(userId, request, "order") as Promise<Order>
  }

  async createTrade(
    userId: string,
    request: CreateTradeRequest,
  ): Promise<Trade> {
    return this.createTransaction(userId, request, "order") as Promise<Trade>
  }

  async createExchange(
    userId: string,
    request: CreateExchangeRequest,
  ): Promise<Exchange> {
    return this.createTransaction(userId, request, "order") as Promise<Exchange>
  }

  async createOffer(
    userId: string,
    request: CreateOfferRequest,
  ): Promise<Offer> {
    return this.createTransaction(userId, request, "offer") as Promise<Offer>
  }

  async createOfferTrade(
    userId: string,
    request: CreateOfferTradeRequest,
  ): Promise<TradeOffer> {
    return this.createTransaction(
      userId,
      request,
      "offer",
    ) as Promise<TradeOffer>
  }

  async createOfferExchange(
    userId: string,
    request: CreateOfferExchangeRequest,
  ): Promise<Offer> {
    return this.createTransaction(userId, request, "offer") as Promise<Offer>
  }

  async getAllTransactions(
    userId: string,
    collection: "orders" | "offers",
  ): Promise<(Order | Trade | Exchange | Offer | TradeOffer)[]> {
    const [snap1, snap2] = await Promise.all([
      this.db.collection(collection).where("requester_id", "==", userId).get(),
      this.db.collection(collection).where("owner_id", "==", userId).get(),
    ])

    return [
      ...snap1.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Order | Exchange | Trade | Offer | TradeOffer),
      })),
      ...snap2.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Order | Exchange | Trade | Offer | TradeOffer),
      })),
    ]
  }
  async getAllPendingOrders(user_id: string): Promise<OrderWithReagent[]> {
    const [snap1, snap2] = await Promise.all([
      this.db.collection("orders").where("requester_id", "==", user_id).get(),
      this.db.collection("orders").where("owner_id", "==", user_id).get(),
    ])

    const res = [
      ...snap1.docs.map((d) => {
        const data = d.data() as Omit<Order, "id">
        return { id: d.id, ...data }
      }),
      ...snap2.docs.map((d) => {
        const data = d.data() as Omit<Order, "id">
        return { id: d.id, ...data }
      }),
    ]

    const pendingOrders = res.filter((order) => order.status === "pending")
    if (pendingOrders.length === 0) {
      return []
    }
    const uniqueReagentIds = [
      ...new Set(pendingOrders.map((o) => o.reagent_id)),
    ]
    const reagentRepo = new ReagentService()
    const reagents = await Promise.all(
      uniqueReagentIds.map((id) => reagentRepo.getReagentById(id)),
    )
    const reagentMap: { [key: string]: any } = {}
    uniqueReagentIds.forEach((id, index) => {
      if (reagents[index]) {
        reagentMap[id] = reagents[index]
      }
    })

    const ordersWithReagents: OrderWithReagent[] = pendingOrders.map(
      (order) => ({
        ...order,
        reagent: reagentMap[order.reagent_id] || null,
      }),
    )

    return ordersWithReagents
  }

  async getTransactionById(
    id: string,
    collection: "orders" | "offers",
  ): Promise<Order | Trade | Exchange | Offer | TradeOffer> {
    try {
      const collectionRef =
        collection === "orders"
          ? FirestoreCollections.orders
          : FirestoreCollections.offers

      const doc = await collectionRef.doc(id).get()

      if (!doc.exists) {
        throw new Error(`${collection.slice(0, -1)} with id - ${id} not found`)
      }

      return { id: doc.id, ...doc.data() } as
        | Order
        | Trade
        | Exchange
        | Offer
        | TradeOffer
    } catch (err) {
      throw new Error(
        `Failed to get ${collection.slice(0, -1)}: ${(err as Error).message}`,
      )
    }
  }

  async updateTransactionStatus(
    id: string,
    status: string,
    collection: "orders" | "offers",
  ): Promise<Order | Trade | Exchange | Offer | TradeOffer> {
    try {
      const collectionRef =
        collection === "orders"
          ? FirestoreCollections.orders
          : FirestoreCollections.offers

      const docRef = collectionRef.doc(id)
      await docRef.update({ status })

      return await this.getTransactionById(id, collection)
    } catch (err) {
      throw new Error(
        `Failed to update ${collection.slice(0, -1)} status: ${(err as Error).message}`,
      )
    }
  }

  async approveOrder(id: string): Promise<Order> {
    return await this.db.runTransaction(async (tx) => {
      const orderRef = FirestoreCollections.orders.doc(id)
      const orderDoc = await tx.get(orderRef)
      if (!orderDoc.exists) {
        throw new Error(`Order ${id} not found`)
      }
      const order = orderDoc.data() as Order

      //read pending orders for requested reagent
      const otherOrdersQuery = this.db
        .collection("orders")
        .where("reagent_id", "==", order.reagent_id)
        .where("status", "==", "pending")
      const otherOrders = await tx.get(otherOrdersQuery)

      //read pending orders for offered reagent
      let otherOfferedOrders: FirebaseFirestore.QuerySnapshot | null = null
      if ("offeredReagentId" in (order as any)) {
        const exchange = order as Exchange
        const otherOfferedOrdersQuery = this.db
          .collection("orders")
          .where("reagent_id", "==", exchange.offeredReagentId)
          .where("status", "==", "pending")
        otherOfferedOrders = await tx.get(otherOfferedOrdersQuery)
      }

      //update order status
      tx.update(orderRef, { status: "approved" })

      //handle trade based on order type
      if ("offeredReagentId" in (order as any)) {
        const exchange = order as Exchange

        //transfer requested reagent, set to private
        const requestedReagentRef = this.db
          .collection("reagents")
          .doc(order.reagent_id)
        tx.update(requestedReagentRef, {
          user_id: order.requester_id,
          visibility: "private",
        })

        //transfer offered reagent, set to private
        const offeredReagentRef = this.db
          .collection("reagents")
          .doc(exchange.offeredReagentId)
        tx.update(offeredReagentRef, {
          user_id: order.owner_id,
          visibility: "private",
        })

        //cancel pending orders for offered reagent
        if (otherOfferedOrders) {
          otherOfferedOrders.docs.forEach((doc) => {
            if (doc.id !== id) {
              tx.update(doc.ref, { status: "canceled" })
            }
          })
        }
      } else {
        //one way transfer for sell/trade, set to private
        const reagentRef = this.db.collection("reagents").doc(order.reagent_id)
        tx.update(reagentRef, {
          user_id: order.requester_id,
          visibility: "private",
        })
      }

      //cancel pending orders for requested reagent
      otherOrders.docs.forEach((doc) => {
        if (doc.id !== id) {
          tx.update(doc.ref, { status: "canceled" })
        }
      })

      return { ...order, status: "approved" }
    })
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
      //fetch requesterOfferedReagentId
      let wantedData: any = null
      if ("offeredReagentId" in (offer as any)) {
        const exchange = offer as Offer
        const wantedRef = this.db.collection("wanted").doc(exchange.reagent_id)
        const wantedDoc = await tx.get(wantedRef)
        wantedData = wantedDoc.data()
      }

      //update offer status
      tx.update(offerRef, { status: "approved" })

      //handle trade
      if ("requesterOfferedReagentId" in (wantedData as any)) {
        const exchange = offer as Offer
        const requesterOfferedReagentId = wantedData.requesterOfferedReagentId

        //transfer requester's offered reagent to the offerer, set to private
        const requestedReagentRef = this.db
          .collection("reagents")
          .doc(requesterOfferedReagentId)
        tx.update(requestedReagentRef, {
          user_id: exchange.requester_id,
          visibility: "private",
        })

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
        const reagentRef = this.db
          .collection("reagents")
          .doc(offer.offeredReagentId)
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
