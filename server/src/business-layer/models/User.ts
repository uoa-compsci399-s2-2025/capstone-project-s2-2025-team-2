export interface User {
  email: string
  displayName: string
  role: "user" | "lab_manager" | "admin"
}
