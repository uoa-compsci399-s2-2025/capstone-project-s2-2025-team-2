import type { User } from "../../business-layer/models/User"
import type { Reagent } from "../../business-layer/models/Reagent"
import { Order } from "../../business-layer/models/Order"
import {
  REAGENTS_COLLECTION,
  USERS_COLLECTION,
  ORDERS_COLLECTION,
} from "./CollectionNames"
import firestore from "./Firestore"

const FirestoreCollections = {
  users: firestore.collection<User>(USERS_COLLECTION),
  reagents: firestore.collection<Reagent>(REAGENTS_COLLECTION),
  orders: firestore.collection<Order>(ORDERS_COLLECTION),
} as const

export default FirestoreCollections
