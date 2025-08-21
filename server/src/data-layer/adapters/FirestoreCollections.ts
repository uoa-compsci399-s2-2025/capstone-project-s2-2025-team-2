import type { Reagent, User } from "data-layer/models/models"
import { REAGENTS_COLLECTION, USERS_COLLECTION } from "./CollectionNames"
import firestore from "./Firestore"

const FirestoreCollections = {
  users: firestore.collection<User>(USERS_COLLECTION),
  reagents: firestore.collection<Reagent>(REAGENTS_COLLECTION),
} as const

export default FirestoreCollections
