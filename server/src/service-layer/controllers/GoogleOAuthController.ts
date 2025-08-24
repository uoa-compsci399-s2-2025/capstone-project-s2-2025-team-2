import { Body, Controller, Get, Post, Query, Route, Tags } from "tsoa"
import GoogleOAuthService from "../../business-layer/services/GoogleOAuthService"
import { GoogleOAuthRequest } from "./request-models/GoogleOAuthRequest"
import { GoogleOAuthResponse } from "./response-models/GoogleOAuthResponse"

@Route("auth/google")
@Tags("Google OAuth")
export class GoogleOAuthController extends Controller {
  private googleOAuthService: GoogleOAuthService

  constructor() {
    super()
    this.googleOAuthService = new GoogleOAuthService()
  }

  /**
   * Handles Google OAuth callback.
   */
  @Get("/callback")
  public async handleCallback( @Query() code?: string, @Query() error?: string
  ): Promise<GoogleOAuthResponse> {
    try {
      const result = await this.googleOAuthService.handleCallback(code, error)
      
      if (!result.success) {
        this.setStatus(400)
      }
      return result

    } catch (error) {
      this.setStatus(500)
      return {
        success: false,
        message: "Internal server error"
      }
    }
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
