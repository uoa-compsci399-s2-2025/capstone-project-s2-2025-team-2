import {
  Body,
  Controller,
  Post,
  Route,
  Tags,
  Security,
  SuccessResponse,
  Delete,
  Path,
  Request,
  Get,
} from "tsoa"
import { SendVerificationCodeRequest } from "../../service-layer/dtos/request/SendVerificationCodeRequest"
import { SendVerificationCodeResponse } from "../../service-layer/dtos/response/SendVerificationCodeResponse"

import AuthService from "../../service-layer/services/AuthService"
import { AuthRepository } from "../../data-layer/repositories/AuthRepository"
import { VerifyCodeRequest } from "../../service-layer/dtos/request/VerifyCodeRequest"
import { VerifyCodeResponse } from "../../service-layer/dtos/response/VerifyCodeResponse"

import { VerifyTokenRequest } from "../../service-layer/dtos/request/VerifyTokenRequest"
import { VerifyTokenResponse } from "../../service-layer/dtos/response/VerifyTokenResponse"
import { AuthDomain } from "../../business-layer/models/AuthDomain"
import { AuthRequest } from "../../service-layer/dtos/request/AuthRequest"
import { AddSignupEmailDomainRequest } from "../../service-layer/dtos/request/SignupEmailDomainRequest"
import { ResetPasswordRequest } from "../../service-layer/dtos/request/ResetPasswordRequest"
import { ResetPasswordResponse } from "../../service-layer/dtos/response/ResetPasswordResponse"

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

  @Post("/reset-password")
  public async resetPassword(
    @Body() requestBody: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const result = await this.authService.resetPassword(
      requestBody.email,
      requestBody.newPassword,
    )
    return result
  }

  @Post("/verify-token")
  public async verifyToken(
    @Body() requestBody: VerifyTokenRequest,
  ): Promise<VerifyTokenResponse> {
    console.log("=== Token Verification Request Received ===")
    console.log("ID Token:", requestBody.idToken.substring(0, 20) + "...")
    console.log("Preferred Name:", requestBody.preferredName)
    console.log("University:", requestBody.university)
    console.log("===========================================")

    const result = await this.authService.verifyIdToken(
      requestBody.idToken,
      requestBody.preferredName,
      requestBody.university,
    )
    return result
  }

  /**
   * Gets all valid valid email domains for signup
   *
   * @returns Promise<string[]>
   */
  @SuccessResponse("200", "Valid email domains retrieved successfully")
  @Get("valid-email-domains")
  public async getValidEmailDomains(): Promise<string[]> {
    try {
      const validDomains = await this.authService.getValidEmailDomains()
      return validDomains
    } catch (err) {
      this.setStatus(500)
      throw new Error(`Failed to get valid signup email domains: ${err}`)
    }
  }

  /**
   * Allows admins to remove a valid signup email domain
   *
   * @param jwt - jwt token is needed for the user to be verified
   * @param domain_id - the ID of the domain to delete
   * @returns Promise<AuthDomain>
   */
  @Security("jwt")
  @SuccessResponse("200", "Valid signup domain removed successfully")
  @Delete("{domain_id}")
  public async removeValidSignupEmailDomain(
    @Path() domain_id: string,
    @Request() request: AuthRequest,
  ): Promise<AuthDomain> {
    try {
      if (request.user.role !== "admin") {
        this.setStatus(403)
        console.error(
          "You don't have permission to remove a valid signup email domain",
        )
      }
      const deletedDomain =
        await new AuthRepository().removeValidSignupEmailDomain(domain_id)
      return deletedDomain
    } catch (err) {
      this.setStatus(500)
      throw new Error(
        `Failed to delete valid signup email domain with ID '${domain_id}': ${err}`,
      )
    }
  }

  /**
   * Allows admins to add a new valid signup email domain
   *
   * @param jwt - jwt token is needed for the user to be verified
   * @Body requestObj - the request object containing data for the new domain
   * @returns Promise<AuthDomain>
   */
  @Security("jwt")
  @SuccessResponse("201", "Valid signup email domain added successfully")
  @Post()
  public async addValidSignupEmailDomain(
    @Body() requestObj: AddSignupEmailDomainRequest,
    @Request() request: AuthRequest,
  ): Promise<AuthDomain> {
    try {
      if (request.user.role !== "admin") {
        this.setStatus(403)
        console.error(
          "You don't have permission to add a valid signup email domain",
        )
      }

      const addedDomain = await new AuthRepository().addValidSignupEmailDomain(
        requestObj as AuthDomain,
      )
      return addedDomain
    } catch (err) {
      this.setStatus(500)
      throw new Error(`Failed to create new valid signup email domain: ${err}`)
    }
  }
}
