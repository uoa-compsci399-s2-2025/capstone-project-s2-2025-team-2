import { Body, Controller, Post, Route, Tags } from "tsoa"

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  message: string
  success: boolean
}

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
}
