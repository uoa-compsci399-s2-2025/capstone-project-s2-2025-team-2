import { FetchResponse } from "openapi-fetch"
import GoogleOAuthRequestDto from "../models/request-models/GoogleOAuthRequestDto"
import SendVerificationCodeRequestDto from "../models/request-models/sendVerificationCodeRequestDto"
import SendVerificationCodeResponseDto from "../models/response-models/sendVerificationCodeResponseDto"
import VerifyCodeRequestDto from "../models/request-models/verifyCodeRequestDto"
import VerifyCodeResponseDto from "../models/response-models/VerifyCodeResponseDto"
import SignUpRequestDto from "../models/request-models/SignUpRequestDto"
import SignUpResponseDto from "../models/response-models/SignUpResponseDto"
import client from "./fetch-client"
import GoogleOAuthResponseDto from "../models/response-models/GoogleOAuthResponseDto"

const AUTH_BASE = "/auth"

const VERIFY_GOOGLE_OAUTH_URL = `${AUTH_BASE}/google/verify`
const SEND_VERIFICATION_CODE_URL = `${AUTH_BASE}/send-verification-code`
const VERIFY_CODE_URL = `${AUTH_BASE}/verify-code`
const SIGN_UP_URL = `${AUTH_BASE}/signup`

export const oauthVerify = async (requestBody: GoogleOAuthRequestDto): Promise<GoogleOAuthResponseDto> => {
  const response = await client.POST(VERIFY_GOOGLE_OAUTH_URL, {
    body: requestBody,
  })

  if (response.error) { throw new Error("Google OAuth verification failed") }

  return response.data
}

export const sendVerificationCode = async (requestBody: SendVerificationCodeRequestDto): Promise<SendVerificationCodeResponseDto> => {
  const response = await client.POST(SEND_VERIFICATION_CODE_URL, {
    body: requestBody,
  })

  if (response.error) { throw new Error("Sending verification code failed") }

  return response.data
}

export const verifyCode = async (requestBody: VerifyCodeRequestDto): Promise<VerifyCodeResponseDto> => {
  const response = await client.POST(VERIFY_CODE_URL, {
    body: requestBody,
  })
  
  if (response.error) { throw new Error("Verification failed") }
  
  return response.data
}

export const signUp = async (requestBody: SignUpRequestDto): Promise<SignUpResponseDto> => {
  const response = await client.POST(SIGN_UP_URL, {
    body: requestBody,
  })

  if (response.error) { throw new Error("Sign up failed") }

  return response.data
}