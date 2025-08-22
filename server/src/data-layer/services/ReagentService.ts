import FirestoreCollections from "../adapters/FirestoreCollections"
import { Reagent, ReagentCategory } from "../models/Reagents"

export class ReagentService {
  async getAllReagents(): Promise<Reagent[]> {
    const reagentsSnapshot = await FirestoreCollections.reagents.get()
    return reagentsSnapshot.docs.map((doc) => doc.data())
  }

  async getReagentsById(id: string): Promise<Reagent | null> {
    const reagentSnapshot = await FirestoreCollections.reagents.doc(id).get()
    if (!reagentSnapshot.exists) {
      return null
    }
    return reagentSnapshot.data()
  }

  async getReagentsByCategory(
    categories: ReagentCategory[],
  ): Promise<Reagent[]> {
    const reagentsSnapshot = await FirestoreCollections.reagents
      .where("categories", "array-contains-any", categories)
      .get()
    return reagentsSnapshot.docs.map((doc) => doc.data())
  }
}
