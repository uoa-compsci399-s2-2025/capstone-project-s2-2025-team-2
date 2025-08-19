import FirestoreCollections from "data-layer/adapters/FirestoreCollections"
import { User } from "data-layer/models/models"

export class UserService {
  async getUser(id: string): Promise<User | null> {
    const userRef = FirestoreCollections.users.doc(id)
    const user = await userRef.get()
    if (!user.exists) {
      console.log(`User - ${id} is not found`)
      return null
    }
    console.log(user.data())
    return user.data() as User
  }
}
