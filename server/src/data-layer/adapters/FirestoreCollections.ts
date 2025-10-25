import type { User } from "../../business-layer/models/User"
import type { Reagent } from "../../business-layer/models/Reagent"
import { Order } from "../../business-layer/models/Order"
import { ChatRoom, Message } from "../../business-layer/models/ChatRoom"
import { AuthDomain } from "../../business-layer/models/AuthDomain"
import {
  REAGENTS_COLLECTION,
  USERS_COLLECTION,
  ORDERS_COLLECTION,
  CHAT_ROOMS_COLLECTION,
  MESSAGES_COLLECTION,
  AUTH_DOMAINS_COLLECTION,
  WANTED_COLLECTION,
  OFFERS_COLLECTION,
} from "./CollectionNames"
import firestore from "./Firestore"

const FirestoreCollections = {
  users: firestore.collection<User>(USERS_COLLECTION),
  reagents: firestore.collection<Reagent>(REAGENTS_COLLECTION),
  orders: firestore.collection<Order>(ORDERS_COLLECTION),
  chatRooms: firestore.collection<ChatRoom>(CHAT_ROOMS_COLLECTION),
  messages: firestore.collection<Message>(MESSAGES_COLLECTION),
  authDomains: firestore.collection<AuthDomain>(AUTH_DOMAINS_COLLECTION),
  wanted: firestore.collection<Reagent>(WANTED_COLLECTION),
  offers: firestore.collection<Order>(OFFERS_COLLECTION),
} as const

export default FirestoreCollections
