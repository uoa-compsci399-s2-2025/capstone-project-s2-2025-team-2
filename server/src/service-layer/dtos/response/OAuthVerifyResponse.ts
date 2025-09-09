import GoogleOAuthUser from "../../../business-layer/models/GoogleOAuthUser"

export interface GoogleOAuthResponse {
  success: boolean
  message: string
  token?: string
  user?: GoogleOAuthUser
}
