export interface AuthRequest {
  user?: {
    uid: string
    name: string
    email?: string
    role: "user" | "lab_manager" | "admin"
  }
}
