export interface GoogleOAuthUser {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
}

export interface GoogleOAuthResponse {
  success: boolean
  message: string
  token?: string
  user?: GoogleOAuthUser
}
