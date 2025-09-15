export interface User {
  email: string
  username: string
  role: "user" | "lab_manager" | "admin"
}
