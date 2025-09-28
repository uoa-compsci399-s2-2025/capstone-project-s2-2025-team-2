import { auth } from "../../business-layer/security/Firebase"
import { AuthRepository } from "../../data-layer/repositories/AuthRepository"

import { generateVerificationCode } from "../../utils/generateVerificationCode"
import EmailService from "./EmailService"
import { SendVerificationCodeResponse } from "../dtos/response/SendVerificationCodeResponse"
import { VerifyCodeResponse } from "../dtos/response/VerifyCodeResponse"

import { VerifyTokenResponse } from "../dtos/response/VerifyTokenResponse"

export default class AuthService {
  private authRepository: AuthRepository
  private emailService: EmailService

  constructor() {
    this.authRepository = new AuthRepository()
    this.emailService = new EmailService()
  }

  public async sendVerificationCode(
    email: string,
  ): Promise<SendVerificationCodeResponse> {
    try {
      // Generate verification code
      const verificationCode = generateVerificationCode()
      await this.authRepository.saveVerificationCode(email, verificationCode)

      // Send verification code via email
      await this.emailService.sendVerificationEmail(email, verificationCode)

      // Return response
      const responseBody: SendVerificationCodeResponse = {
        success: true,
        message: "Verification code sent successfully",
      }
      return responseBody
    } catch (err) {
      console.error("Error sending verification code:", err)
      throw new Error("Failed to send verification code")
    }
  }

  public async verifyCode(
    email: string,
    inputCode: string,
  ): Promise<VerifyCodeResponse> {
    // Verify code
    const result = await this.authRepository.verifyCode(email, inputCode)

    // Return response
    const responseBody: VerifyCodeResponse = {
      success: result,
      message: result
        ? "Verification code verified successfully"
        : "Verification code verification failed",
    }
    return responseBody
  }

  public async verifyIdToken(
    idToken: string,
    preferredName?: string,
    university?: string,
  ): Promise<VerifyTokenResponse> {
    try {
      // Verify the ID token using Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(idToken)

      // Extract user information from the decoded token
      const uid = decodedToken.uid
      const email = decodedToken.email

      // Check if user exists in Firestore, if not create user record
      await this.ensureUserExists(uid, email, preferredName, university)

      const responseBody: VerifyTokenResponse = {
        success: true,
        message: "Token verified successfully",
        uid: uid,
        email: email,
      }
      return responseBody
    } catch (err: any) {
      console.error("Error verifying ID token:", err)

      let errorMessage = "Token verification failed"
      if (err.code === "auth/id-token-expired") {
        errorMessage = "Token has expired. Please sign in again."
      } else if (err.code === "auth/invalid-id-token") {
        errorMessage = "Invalid token. Please sign in again."
      } else if (err.code === "auth/argument-error") {
        errorMessage = "Invalid token format."
      }

      const responseBody: VerifyTokenResponse = {
        success: false,
        message: errorMessage,
      }
      return responseBody
    }
  }

  private async ensureUserExists(
    uid: string,
    email: string | undefined,
    preferredName?: string,
    university?: string,
  ): Promise<void> {
    try {
      // Check if user already exists in Firestore
      const userDoc = await this.authRepository.getUserByUid(uid)

      if (!userDoc) {
        // User doesn't exist in Firestore, create user record
        await this.authRepository.saveUser(
          uid,
          email || "",
          preferredName || "",
          university || "",
        )
        console.log(`Created user record in Firestore for UID: ${uid}`)
      }
    } catch (error) {
      console.error("Error ensuring user exists:", error)
      // Don't throw error here as token verification was successful
    }
  }
}
