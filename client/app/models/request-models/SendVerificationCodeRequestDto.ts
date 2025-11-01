export default interface SendVerificationCodeRequestDto {
  email: string
  purpose?: "signup" | "forgot-password"
}
