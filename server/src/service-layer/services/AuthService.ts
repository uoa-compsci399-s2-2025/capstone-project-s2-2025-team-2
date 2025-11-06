import { auth } from "../../business-layer/security/Firebase"
import { AuthRepository } from "../../data-layer/repositories/AuthRepository"

import { generateVerificationCode } from "../../utils/generateVerificationCode"
import EmailService from "./EmailService"
import { SendVerificationCodeResponse } from "../dtos/response/SendVerificationCodeResponse"
import { VerifyCodeResponse } from "../dtos/response/VerifyCodeResponse"
import { VerifyTokenResponse } from "../dtos/response/VerifyTokenResponse"
import { ResetPasswordResponse } from "../dtos/response/ResetPasswordResponse"

import {
  EmailDomainValidationSchema,
  type EmailDomainValidationType,
} from "../../../../shared/zod-schemas/signup-email-validation"

export default class AuthService {
  private authRepository: AuthRepository
  private emailService: EmailService

  constructor() {
    this.authRepository = new AuthRepository()
    this.emailService = new EmailService()
  }

  public async sendVerificationCode(
    email: string,
    purpose: "signup" | "forgot-password" = "signup",
  ): Promise<SendVerificationCodeResponse> {
    console.log("=== Auth Service: sendVerificationCode Started ===")
    console.log("Email parameter:", email)
    console.log("Purpose:", purpose)

    try {
      // Check if user already exists in Firebase Auth
      console.log("Checking if user exists in Firebase Auth...")
      try {
        const user = await auth.getUserByEmail(email)
        console.log("User found in Firebase Auth:", user.uid)

        // For signup: user should NOT exist (return error)
        // For forgot-password: user SHOULD exist (continue)
        if (purpose === "signup") {
          const responseBody: SendVerificationCodeResponse = {
            success: false,
            message:
              "This email is already registered. Please sign in instead.",
          }
          console.log(
            "Returning error response (user exists for signup):",
            responseBody,
          )
          return responseBody
        } else {
          // For forgot-password, user exists is expected and correct
          console.log(
            "User exists (expected for forgot-password), continuing...",
          )
        }
      } catch (error: any) {
        console.log("User check error:", error)
        console.log("Error code:", error.code)
        // User doesn't exist (auth/user-not-found)
        if (error.code !== "auth/user-not-found") {
          // Other error occurred
          console.error("Unexpected error checking user existence:", error)
          throw new Error("Failed to check user existence")
        }

        // For signup: user not found is expected (continue)
        // For forgot-password: user not found is an error
        if (purpose === "forgot-password") {
          const responseBody: SendVerificationCodeResponse = {
            success: false,
            message: "This email is not registered. Please sign up instead.",
          }
          console.log(
            "Returning error response (user not found for forgot-password):",
            responseBody,
          )
          return responseBody
        }
        console.log("User not found (expected for signup)")
      }

      // Generate verification code
      console.log("Generating verification code...")
      const verificationCode = generateVerificationCode()
      console.log("Verification code generated:", verificationCode)

      console.log("Saving verification code to repository...")
      await this.authRepository.saveVerificationCode(email, verificationCode)
      console.log("Verification code saved successfully")

      // Send verification code via email
      console.log("Sending verification email...")
      await this.emailService.sendVerificationEmail(email, verificationCode)
      console.log("Verification email sent successfully")

      // Return response
      const responseBody: SendVerificationCodeResponse = {
        success: true,
        message: "Verification code sent successfully",
      }
      console.log("Returning success response:", responseBody)
      return responseBody
    } catch (err) {
      console.error("=== Auth Service: Error in sendVerificationCode ===")
      console.error("Error type:", err?.constructor?.name)
      console.error(
        "Error message:",
        err instanceof Error ? err.message : String(err),
      )
      console.error(
        "Error stack:",
        err instanceof Error ? err.stack : undefined,
      )
      console.error("Full error:", err)
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
    displayName?: string,
    university?: string,
  ): Promise<VerifyTokenResponse> {
    try {
      // Verify the ID token using Firebase Admin SDK
      const decodedToken = await auth.verifyIdToken(idToken)

      // Extract user information from the decoded token
      const uid = decodedToken.uid
      const email = decodedToken.email

      // Check if user exists in Firestore, if not create user record
      await this.ensureUserExists(uid, email, displayName, university)

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
    displayName?: string,
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
          displayName || "",
          university || "",
        )
        console.log(`Created user record in Firestore for UID: ${uid}`)
      }
    } catch (error) {
      console.error("Error ensuring user exists:", error)
      // Don't throw error here as token verification was successful
    }
  }

  async getValidEmailDomains() {
    const emailDomainDocs =
      await this.authRepository.getValidSignupEmailDomains()

    const validEmailDomains: string[][] = []
    emailDomainDocs.forEach((doc) => {
      validEmailDomains.push(doc.emailDomains)
    })

    // as some email domain objects within the db's collection have more than 1 domain, we need to flatten the array before returning it
    return validEmailDomains.flat(Infinity) as string[]
  }

  async validateEmailDomain(email: string): Promise<boolean> {
    // get all current valid email domains and check users email against them
    const validEmails = await new AuthService().getValidEmailDomains()

    try {
      // validate user email against zod input
      EmailDomainValidationSchema(validEmails).parse({
        email,
      }) as EmailDomainValidationType
      return true
    } catch (err) {
      console.error(
        `User email is a not an accepted institutional email: ${err}`,
      )
      return false
    }
  }

  public async resetPassword(
    email: string,
    newPassword: string,
  ): Promise<ResetPasswordResponse> {
    try {
      // Get user by email to find their UID
      const user = await this.authRepository.getUserByEmail(email)
      console.log("User found:", user)
      if (!user) {
        return {
          success: false,
          message: "User not found",
        }
      }

      // Update password in Firebase Auth
      await auth.updateUser(user.uid, {
        password: newPassword,
      })

      return {
        success: true,
        message: "Password reset successfully",
      }
    } catch (err) {
      console.error("Error resetting password:", err)
      console.error("Error details:", {
        name: err instanceof Error ? err.name : "Unknown",
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined,
      })

      // Check if it's a Google OAuth user error
      // Firebase Admin SDK errors might have different structure
      const errorMessage = err instanceof Error ? err.message : String(err)
      const errorCode = (err as any)?.code || (err as any)?.errorInfo?.code

      console.log("Checking for Google OAuth error:", {
        errorMessage,
        errorCode,
      })

      if (
        errorMessage.includes("auth/invalid-uid") ||
        errorCode === "auth/invalid-uid"
      ) {
        console.log("Detected Google OAuth user error")
        return {
          success: false,
          message:
            "Google sign-in users cannot change their password in CoLab. Please use Google to manage your account.",
        }
      }

      return {
        success: false,
        message: "Failed to reset password",
      }
    }
  }
}
