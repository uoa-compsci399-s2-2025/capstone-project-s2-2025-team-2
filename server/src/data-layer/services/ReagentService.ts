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

  /**
   * Retrieves reagents by its categories from the Firestore database.
   *
   * @param categories - The category of the reagents to retrive.
   * @returns Promise<Reagent[]> - Returns an array of reagents.
   */
}
