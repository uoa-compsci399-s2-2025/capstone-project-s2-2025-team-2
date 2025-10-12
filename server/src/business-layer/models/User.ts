export interface User {
  email: string
  displayName: string
  preferredName: string
  university: string
  about?: string
  role: "user" | "lab_manager" | "admin"
  image?: string
}
