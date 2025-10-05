// libs/packages
import { v4 as uuidv4 } from "uuid"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// config
import { storage } from "../config/firebase"

export const uploadReagentImage = async (
  reagentUid: string,
  file: File,
): Promise<string | null> => {
  const fileId = uuidv4() // unlike firestore db where uids are randomly generated, this isnt the case for firebase storage
  const reagentImgRef = ref(storage, `reagents/${reagentUid}/${fileId}`)

  try {
    await uploadBytes(reagentImgRef, file)
    return await getDownloadURL(reagentImgRef)
  } catch (err) {
    console.error("Error uploading reagent image:", err)
    return null
  }
}
