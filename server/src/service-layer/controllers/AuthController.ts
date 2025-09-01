import { Body, Controller, Post, Route, Tags } from "tsoa"
import { SendVerificationCodeRequest } from "./request-models/SendVerificationCodeRequest"
import { SendVerificationCodeResponse } from "./response-models/SendVerificationCodeResponse"
import { LoginRequest } from "./request-models/LoginRequest"
import { LoginResponse } from "./response-models/LoginResponse"
import AuthService from "business-layer/services/AuthService"
import { VerifyCodeRequest } from "./request-models/VerifyCodeRequest"
import { VerifyCodeResponse } from "./response-models/VerifyCodeResponse"

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {

  private authService: AuthService

  constructor() {
    super()
    this.authService = new AuthService()
  }

  @Post("/login")
  public async login(
    @Body() requestBody: LoginRequest,
  ): Promise<LoginResponse> {
    console.log("=== Login Request Received ===")
    console.log("Email:", requestBody.email)
    console.log("Password:", requestBody.password)
    console.log("==============================")
    // TODO: Implement login logic

    return {
      message: "Login request received successfully",
      success: true,
    }
  }

  @Post("/send-verification-code")
  public async sendVerificationCode(
    @Body() requestBody: SendVerificationCodeRequest,
  ): Promise<SendVerificationCodeResponse> {
    const result = await this.authService.sendVerificationCode(requestBody.email)
    return result
  }

  @Post("/verify-code")
  public async verifyCode(
    @Body() requestBody: VerifyCodeRequest,
  ): Promise<VerifyCodeResponse> {
    const result = await this.authService.verifyCode(requestBody.email, requestBody.inputCode)
    return result
  }
}
