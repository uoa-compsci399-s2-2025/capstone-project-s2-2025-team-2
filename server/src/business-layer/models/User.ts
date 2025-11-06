export interface User {
  email: string
  displayName: string
  lastName?: string
  university: string
  about?: string
  role: "user" | "lab_manager" | "admin"
  image?: string
}
