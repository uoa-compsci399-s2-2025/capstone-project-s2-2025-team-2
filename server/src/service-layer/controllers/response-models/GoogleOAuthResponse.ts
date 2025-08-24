import GoogleOAuthUser from "../objects/GoogleOAuthUser"

export interface GoogleOAuthResponse {
  success: boolean
  message: string
  token?: string
  user?: GoogleOAuthUser
}
