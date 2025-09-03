import { Body, Controller, Post, Route, Tags } from "tsoa"
import { SendVerificationCodeRequest } from "../../service-layer/dtos/request/SendVerificationCodeRequest"
import { SendVerificationCodeResponse } from "../../service-layer/dtos/response/SendVerificationCodeResponse"
import { LoginRequest } from "../../service-layer/dtos/request/LoginRequest"
import { LoginResponse } from "../../service-layer/dtos/response/LoginResponse"
import AuthService from "service-layer/services/AuthService"
import { VerifyCodeRequest } from "../../service-layer/dtos/request/VerifyCodeRequest"
import { VerifyCodeResponse } from "../../service-layer/dtos/response/VerifyCodeResponse"
import { SignUpRequest } from "../../service-layer/dtos/request/SignUpRequest"
import { SignUpResponse } from "../../service-layer/dtos/response/SignUpResponse"

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

  @Post("/signup")
  public async signUp(
    @Body() requestBody: SignUpRequest,
  ): Promise<SignUpResponse> {
    console.log("=== Sign Up Request Received ===")
    console.log("Email:", requestBody.email)
    console.log("Password:", requestBody.password)
    console.log("================================")
    
    const result = await this.authService.signUp(requestBody.email, requestBody.password)
    return result
  }
}
