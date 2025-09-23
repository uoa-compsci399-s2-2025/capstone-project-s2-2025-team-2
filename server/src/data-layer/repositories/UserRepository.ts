import FirestoreCollections from "../adapters/FirestoreCollections"
import { User } from "../../business-layer/models/User"

export class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot = await FirestoreCollections.users.get()
      console.log(`Found ${snapshot.size} users in collection`)
      if (snapshot.empty) {
        return []
      }
      const users: User[] = []
      snapshot.forEach((doc) => {
        const userData = doc.data()
        users.push(userData as User)
      })
      return users
    } catch (error) {
      console.error("Error fetching all users:", error)
      throw error
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const userDoc = await FirestoreCollections.users.doc(id).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        return {
          id: userDoc.id,
          ...userData,
        } as User
      }
      return null
    } catch (err) {
      console.error("Error fetching user by ID:", err)
      return null
    }
  }
  
}
