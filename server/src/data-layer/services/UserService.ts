import FirestoreCollections from "../adapters/FirestoreCollections"
import { User } from "data-layer/models/models"

export class UserService {
  async getUser(username: string): Promise<User | null> {
    const userRef = FirestoreCollections.users.doc(username)
    const user = await userRef.get()
    if (!user.exists) {
      console.log(`User - ${username} is not found`)
      return null
    }
    console.log(user.data())
    return user.data() as User
  }
}
