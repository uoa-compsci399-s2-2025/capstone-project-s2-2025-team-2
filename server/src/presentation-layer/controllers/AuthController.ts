import { Body, Controller, Post, Route, Tags } from "tsoa"
import { SendVerificationCodeRequest } from "../../service-layer/dtos/request/SendVerificationCodeRequest"
import { SendVerificationCodeResponse } from "../../service-layer/dtos/response/SendVerificationCodeResponse"

import AuthService from "service-layer/services/AuthService"
import { VerifyCodeRequest } from "../../service-layer/dtos/request/VerifyCodeRequest"
import { VerifyCodeResponse } from "../../service-layer/dtos/response/VerifyCodeResponse"

import { VerifyTokenRequest } from "../../service-layer/dtos/request/VerifyTokenRequest"
import { VerifyTokenResponse } from "../../service-layer/dtos/response/VerifyTokenResponse"

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {
  private authService: AuthService

  constructor() {
    super()
    this.authService = new AuthService()
  }



  @Post("/send-verification-code")
  public async sendVerificationCode(
    @Body() requestBody: SendVerificationCodeRequest,
  ): Promise<SendVerificationCodeResponse> {
    const result = await this.authService.sendVerificationCode(
      requestBody.email,
    )
    return result
  }

  @Post("/verify-code")
  public async verifyCode(
    @Body() requestBody: VerifyCodeRequest,
  ): Promise<VerifyCodeResponse> {
    const result = await this.authService.verifyCode(
      requestBody.email,
      requestBody.inputCode,
    )
    return result
  }



  @Post("/verify-token")
  public async verifyToken(
    @Body() requestBody: VerifyTokenRequest,
  ): Promise<VerifyTokenResponse> {
    console.log("=== Token Verification Request Received ===")
    console.log("ID Token:", requestBody.idToken.substring(0, 20) + "...")
    console.log("===========================================")

    const result = await this.authService.verifyIdToken(requestBody.idToken)
    return result
  }
}
