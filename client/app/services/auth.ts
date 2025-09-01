import GoogleOAuthRequestDto from "../models/request-models/GoogleOAuthRequestDto"
import SendVerificationCodeRequestDto from "../models/request-models/sendVerificationCodeRequestDto"
import client from "./fetch-client"

const AUTH_BASE = "/auth"

const VERIFY_GOOGLE_OAUTH_URL = `${AUTH_BASE}/google/verify`
const SEND_VERIFICATION_CODE_URL = `${AUTH_BASE}/send-verification-code`

export const oauthVerify = async (requestBody: GoogleOAuthRequestDto) => {
  const response = await client.POST(VERIFY_GOOGLE_OAUTH_URL, {
    body: requestBody,
  })
  return response
}

export const sendVerificationCode = async (requestBody: SendVerificationCodeRequestDto) => {
  const response = await client.POST(SEND_VERIFICATION_CODE_URL, {
    body: requestBody,
  })
  return response
}
