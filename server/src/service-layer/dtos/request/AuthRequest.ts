export interface AuthRequest {
  user?: {
    uid: string
    name: string
    email?: string
  }
  lab_manager?: {
    uid: string
    name: string
    email?: string
    role: "lab_manager"
  }
  admin?: {
    uid: string
    name: string
    email?: string
    role: "admin"
  }
}
