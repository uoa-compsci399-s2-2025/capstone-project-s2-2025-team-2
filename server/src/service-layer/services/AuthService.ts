import { auth } from "business-layer/security/Firebase"
import { AuthRepository } from "data-layer/repositories/AuthRepository"
import type { UserRecord } from "firebase-admin/auth"
import { generateVerificationCode } from "utils/generateVerificationCode"
import EmailService from "./EmailService"
import { SendVerificationCodeResponse } from "../dtos/response/SendVerificationCodeResponse"
import { VerifyCodeResponse } from "service-layer/dtos/response/VerifyCodeResponse"
import { SignUpResponse } from "../dtos/response/SignUpResponse"

export default class AuthService {

  private authRepository: AuthRepository
  private emailService: EmailService

  constructor() {
    this.authRepository = new AuthRepository()
    this.emailService = new EmailService()
  }

  public async createUser( email: string, password: string, ): Promise<UserRecord> {
    let userRecord: UserRecord
    try {
      userRecord = await auth.createUser({
        email,
        password,
      })
    } catch (err) {
      console.error("Error creating user:", err)
      throw new Error("Failed to create user")
    }
    return userRecord
  }

  public async sendVerificationCode(email: string): Promise<SendVerificationCodeResponse> {
    try {
      // Generate verification code
      const verificationCode = generateVerificationCode();
      await this.authRepository.saveVerificationCode(email, verificationCode);
      
      // Send verification code via email
      await this.emailService.sendVerificationEmail(email, verificationCode);
      
      // Return response
      const responseBody: SendVerificationCodeResponse = {
        success: true,
        message: "Verification code sent successfully"
      };
      return responseBody;

    } catch (err) {
      console.error("Error sending verification code:", err)
      throw new Error("Failed to send verification code")
    }
  }

  public async verifyCode(email: string, inputCode: string): Promise<VerifyCodeResponse> {
    // Verify code
    const result = await this.authRepository.verifyCode(email, inputCode)

    // Return response
    const responseBody: VerifyCodeResponse = {
      success: result,
      message: result ? "Verification code verified successfully" : "Verification code verification failed"
    }
    return responseBody
  }

  public async signUp(email: string, password: string): Promise<SignUpResponse> {
    try {
      // Create user with Firebase Auth (password is automatically hashed by Firebase)
      const userRecord = await this.createUser(email, password)
      
      // Save user data to Firestore
      await this.authRepository.saveUser(userRecord.uid, email)
      
      // Return success response
      const responseBody: SignUpResponse = {
        success: true,
        message: "User created successfully"
      }
      return responseBody

    } catch (err) {
      console.error("Error during sign up:", err)
      const responseBody: SignUpResponse = {
        success: false,
        message: "Failed to create user"
      }
      return responseBody
    }
  }

}
