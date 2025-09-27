export interface User {
  email: string
  displayName: string
  preferredName: string
  university: string
  role: "user" | "lab_manager" | "admin"
}
