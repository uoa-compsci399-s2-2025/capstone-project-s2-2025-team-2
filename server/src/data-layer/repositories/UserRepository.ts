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

  /**
   * Fetch user email by user ID.
   *
   * @param id - The ID of the user whose email is to be fetched.
   */
  async getUserEmailById(id: string): Promise<string | null> {
    try {
      const userDoc = await FirestoreCollections.users.doc(id).get()
      if (userDoc.exists) {
        const userData = userDoc.data()
        return userData?.email || null
      }
      return null
    } catch (err) {
      console.error("Error fetching user email by ID:", err)
      return null
    }
  }

  /**
   * Fetch user by email.
   *
   * @param email - The email of the user to fetch.
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const userQuerySnapshot = await FirestoreCollections.users
        .where("email", "==", email)
        .get()
      if (!userQuerySnapshot.empty) {
        const userDoc = userQuerySnapshot.docs[0]
        const userData = userDoc.data()
        return userData as User
      }
      return null
    } catch (err) {
      console.error("Error fetching user email by ID:", err)
      return null
    }
  }
}
