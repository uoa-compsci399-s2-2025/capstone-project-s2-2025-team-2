import FirestoreCollections from "../adapters/FirestoreCollections"
import { Reagent, ReagentCategory } from "../models/Reagent"

export class ReagentService {
  /**
   * Retrieves all reagents from the Firestore database.
   *
   * @returns Promise<Reagent[]> - Returns an array of all reagents.
   */
  async getAllReagents(): Promise<Reagent[]> {
    const reagentsSnapshot = await FirestoreCollections.reagents.get()
    return reagentsSnapshot.docs.map((doc) => doc.data())
  }

  /**
   * Retrieves a reagent by its ID from the Firestore database.
   *
   * @param id - The ID of the reagent to retrieve.
   * @returns Promise<Reagent | null> - Returns the reagent if found, otherwise null.
   */
  async getReagentsById(id: string): Promise<Reagent | null> {
    const reagentSnapshot = await FirestoreCollections.reagents.doc(id).get()
    if (!reagentSnapshot.exists) {
      return null
    }
    return reagentSnapshot.data()
  }

  /**
   * Retrieves reagents by its categories from the Firestore database.
   *
   * @param categories - The category of the reagents to retrive.
   * @returns Promise<Reagent[]> - Returns an array of reagents.
   */
  async getReagentsByCategory(
    categories: ReagentCategory[],
  ): Promise<Reagent[]> {
    const reagentsSnapshot = await FirestoreCollections.reagents
      .where("categories", "array-contains-any", categories)
      .get()
    return reagentsSnapshot.docs.map((doc) => doc.data())
  }

  async createReagent(newReagent: Reagent): Promise<Reagent> {
    const docRef = await FirestoreCollections.reagents.add(newReagent)
    const createdReagent = {
      ...newReagent,
      id: docRef.id,
    }
    return createdReagent
  }

  async deleteReagent(id: string): Promise<Reagent> {
    try {
      const docRef = await FirestoreCollections.reagents.doc(id)
      if (docRef == null) {
        throw new Error(`Reagent - ${id} not found`)
      }
      const reagent = (await docRef.get()).data() as Reagent
      await docRef.delete()
      return reagent
    } catch (err) {
      console.log(err)
      throw new Error(`Failed to delete reagent - ${id}: ${err}`)
    }
  }
}
