import { Body, Controller, Post, Route, Tags } from "tsoa"
import { SendVerificationCodeRequest } from "./request-models/SendVerificationCodeRequest"
import { SendVerificationCodeResponse } from "./response-models/SendVerificationCodeResponse"
import { LoginRequest } from "./request-models/LoginRequest"
import { LoginResponse } from "./response-models/LoginResponse"

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {
  @Post("/login")
  public async login(
    @Body() requestBody: LoginRequest,
  ): Promise<LoginResponse> {
    console.log("=== Login Request Received ===")
    console.log("Email:", requestBody.email)
    console.log("Password:", requestBody.password)
    console.log("==============================")

    return {
      message: "Login request received successfully",
      success: true,
    }
  }

  @Post("/send-verification-code")
  public async sendVerificationCode(
    @Body() requestBody: SendVerificationCodeRequest,
  ): Promise<SendVerificationCodeResponse> {
    console.log("=== Send Verification Code Request Received ===")
    console.log("Email:", requestBody.email)
    console.log("==============================")

    return {
      success: true,
      message: "Verification code sent successfully",
    }
  }
}
