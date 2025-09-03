import { db } from "business-layer/security/Firebase";

export class AuthRepository {
  async saveVerificationCode(email: string, verificationCode: string): Promise<void> {
    await db.collection("verificationCodes").doc(email).set({
      email,
      verificationCode,
      createdAt: new Date(),
    })
  }

  async verifyCode(email: string, inputCode: string): Promise<boolean> {
    const doc = await db.collection("verificationCodes").doc(email).get();
    if (!doc.exists) {
      return false;
    }
    const data = doc.data();
    if (!data) {
      return false;
    }
    if (data.verificationCode !== inputCode) {
      return false;
    }
    return true;
  }

  async saveUser(uid: string, email: string): Promise<void> {
    await db.collection("users").doc(uid).set({
      uid,
      email,
      createdAt: new Date(),
    })
  }
}