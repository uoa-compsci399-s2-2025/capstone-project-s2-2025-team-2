import { db } from "../../business-layer/security/Firebase"
import FirestoreCollections from "../adapters/FirestoreCollections"
import { AuthDomain } from "../../business-layer/models/AuthDomain"

export class AuthRepository {
  async saveVerificationCode(
    email: string,
    verificationCode: string,
  ): Promise<void> {
    await db.collection("verificationCodes").doc(email).set({
      email,
      verificationCode,
      createdAt: new Date(),
    })
  }

  async verifyCode(email: string, inputCode: string): Promise<boolean> {
    const doc = await db.collection("verificationCodes").doc(email).get()
    if (!doc.exists) {
      return false
    }
    const data = doc.data()
    if (!data) {
      return false
    }
    if (data.verificationCode !== inputCode) {
      return false
    }
    return true
  }

  async saveUser(
    uid: string,
    email: string,
    preferredName: string,
    university: string,
  ): Promise<void> {
    await db.collection("users").doc(uid).set({
      uid,
      email,
      preferredName,
      university,
      createdAt: new Date(),
    })
  }

  async getUserByUid(uid: string): Promise<any> {
    const doc = await db.collection("users").doc(uid).get()
    if (doc.exists) {
      return doc.data()
    }
    return null
  }

  async removeValidSignupEmailDomain(domain_id: string): Promise<AuthDomain> {
    try {
      const docRef = FirestoreCollections.authDomains.doc(domain_id)
      if (!docRef)
        throw new Error(`Signup email domain with ID '${domain_id}' not found`)

      const domain = (await docRef.get()).data() as AuthDomain
      await docRef.delete()
      return domain
    } catch (err) {
      console.error(err)
      throw new Error(
        `Failed to remove valid signup email domain with ID '${domain_id}': ${err}`,
      )
    }
  }

  async addValidSignupEmailDomain(newDomain: AuthDomain): Promise<AuthDomain> {
    try {
      const docRef = await FirestoreCollections.authDomains.add(newDomain)
      const createdDomain = { ...newDomain, id: docRef.id }
      return createdDomain
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to add a new valid signup email domain: ${err}`)
    }
  }

  async getValidSignupEmailDomains(): Promise<AuthDomain[]> {
    try {
      const snapshot = await FirestoreCollections.authDomains.get()
      if (snapshot.empty) return []

      const authDomains: AuthDomain[] = []
      snapshot.forEach((doc) => {
        authDomains.push(doc.data())
      })

      return authDomains
    } catch (err) {
      console.error(err)
      throw new Error(`Failed to get valid signup email domains: ${err}`)
    }
  }
}
