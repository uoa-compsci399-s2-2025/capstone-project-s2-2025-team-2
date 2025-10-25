// libs/packages
import { v4 as uuidv4 } from "uuid"
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage"
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

export const uploadProfilePicture = async (
  userId: string,
  file: File,
): Promise<string | null> => {
  try {
    const profileRef = ref(storage, `profilePic/${userId}`)
    await uploadBytes(profileRef, file)
    return await getDownloadURL(profileRef)
  } catch (error) {
    console.error("Error uploading profile picture:", error)
    throw error
  }
}

export const deleteReagentImage = async (
  imageUrl: string,
): Promise<boolean> => {
  try {
    // firebase img url format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?{params}
    const urlPart = imageUrl.split("/o/")[1].split("?")[0]
    const filePath = decodeURIComponent(urlPart)
    const fileRef = ref(storage, filePath)

    await deleteObject(fileRef)
    console.log(`Deleted image: '${imageUrl}'`)
    return true
  } catch (err) {
    console.error(`Error deleting image '${imageUrl}': ${err}`)
    return false
  }
}
