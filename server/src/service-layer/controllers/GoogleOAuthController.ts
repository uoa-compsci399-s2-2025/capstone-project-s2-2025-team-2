import { Body, Controller, Get, Post, Query, Route, Tags } from "tsoa"
import GoogleOAuthService from "../../business-layer/services/GoogleOAuthService"
import { GoogleOAuthRequest } from "./request-models/OAuthVerifyRequest"
import { GoogleOAuthResponse } from "./response-models/OAuthVerifyResponse"

@Route("auth/google")
@Tags("Google OAuth")
export class GoogleOAuthController extends Controller {
  private googleOAuthService: GoogleOAuthService

  constructor() {
    super()
    this.googleOAuthService = new GoogleOAuthService()
  }

  /**
   * Verifies Google ID token and authenticates user.
   */
  @Post("/verify")
  public async verifyToken( @Body() requestBody: GoogleOAuthRequest
  ): Promise<GoogleOAuthResponse> {
    try {
      const result = await this.googleOAuthService.verifyTokenAndAuthenticate(
        requestBody.idToken
      )
      
      return result
    } catch (error) {
      this.setStatus(401)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Authentication failed"
      }
    }
  }
}
