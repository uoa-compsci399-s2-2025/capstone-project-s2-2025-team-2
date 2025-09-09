export interface AuthRequest {
  user?: {
    uid: string
    name: string
    email?: string
  }
}
