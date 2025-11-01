export interface SendVerificationCodeRequest {
  email: string
  purpose?: "signup" | "forgot-password"
}
