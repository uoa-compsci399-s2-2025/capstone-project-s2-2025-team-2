import type { User } from "data-layer/models/models"
import { USERS_COLLECTION } from "./CollectionNames"
import firestore from "./Firestore"

const FirestoreCollections = {
  users: firestore.collection<User>(USERS_COLLECTION),
} as const

export default FirestoreCollections
