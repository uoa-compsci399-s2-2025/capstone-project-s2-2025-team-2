import { FetchResponse } from "openapi-fetch"
import GoogleOAuthRequestDto from "../models/request-models/GoogleOAuthRequestDto"
import SendVerificationCodeRequestDto from "../models/request-models/SendVerificationCodeRequestDto"
import SendVerificationCodeResponseDto from "../models/response-models/SendVerificationCodeResponseDto"
import VerifyCodeRequestDto from "../models/request-models/VerifyCodeRequestDto"
import VerifyCodeResponseDto from "../models/response-models/VerifyCodeResponseDto"
import client from "./fetch-client"
import GoogleOAuthResponseDto from "../models/response-models/GoogleOAuthResponseDto"
import { getIdToken } from "./firebase-auth"

const AUTH_BASE = "/auth"

const VERIFY_GOOGLE_OAUTH_URL = `${AUTH_BASE}/google/verify`
const SEND_VERIFICATION_CODE_URL = `${AUTH_BASE}/send-verification-code`
const VERIFY_CODE_URL = `${AUTH_BASE}/verify-code`
const VERIFY_TOKEN_URL = `${AUTH_BASE}/verify-token`

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

//            function: verifyToken           //
export const verifyToken = async (): Promise<any> => {
  try {
    // Get ID token from Firebase Auth
    const idToken = await getIdToken()
    
    if (!idToken) {
      throw new Error("No ID token available")
    }
    
    // Call backend to verify token and save/verify user in Firestore
    const response = await client.POST(VERIFY_TOKEN_URL, {
      body: { idToken }
    })

    console.log("Token verification response:", response.data)
    
    if (response.error) {
      throw new Error("Token verification failed")
    }
    
    return response.data
  } catch (error) {
    console.error("Error verifying token:", error)
    throw error
  }
}



