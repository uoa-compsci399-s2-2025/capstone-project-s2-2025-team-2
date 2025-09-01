import { auth } from "business-layer/security/Firebase"
import { AuthRepository } from "data-layer/repository/AuthRepository"
import type { UserRecord } from "firebase-admin/auth"
import { generateVerificationCode } from "utils/generateVerificationCode"
import EmailService from "./EmailService"
import { SendVerificationCodeResponse } from "../../service-layer/controllers/response-models/SendVerificationCodeResponse"

export default class AuthService {

  private authRepository: AuthRepository
  private emailService: EmailService

  constructor() {
    this.authRepository = new AuthRepository()
    this.emailService = new EmailService()
  }

  public async createUser(
    email: string,
    password: string,
  ): Promise<UserRecord> {
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

}
