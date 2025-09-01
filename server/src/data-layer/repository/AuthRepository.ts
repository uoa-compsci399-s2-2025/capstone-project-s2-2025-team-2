import { db } from "business-layer/security/Firebase";

export class AuthRepository {
  async saveVerificationCode(email: string, verificationCode: string): Promise<void> {
    await db.collection("verificationCodes").doc(email).set({
      email,
      verificationCode,
      createdAt: new Date(),
    })
  }

}