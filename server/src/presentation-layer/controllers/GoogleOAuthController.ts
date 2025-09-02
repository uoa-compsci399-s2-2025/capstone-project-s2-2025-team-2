import { Body, Controller, Post, Route, Tags } from "tsoa"
import GoogleOAuthService from "../../service-layer/services/GoogleOAuthService"
import { GoogleOAuthRequest } from "../../service-layer/dtos/request-models/OAuthVerifyRequest"
import { GoogleOAuthResponse } from "../../service-layer/dtos/response-models/OAuthVerifyResponse"

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
  public async verifyToken(
    @Body() requestBody: GoogleOAuthRequest,
  ): Promise<GoogleOAuthResponse> {
    try {
      const result = await this.googleOAuthService.verifyTokenAndAuthenticate(
        requestBody.idToken,
      )

      return result
    } catch (error) {
      this.setStatus(401)
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Authentication failed",
      }
    }
  }
}
