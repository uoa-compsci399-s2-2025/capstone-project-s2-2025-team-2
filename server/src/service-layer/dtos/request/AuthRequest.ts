import type * as express from "express"
export interface AuthRequest extends express.Request {
  user?: {
    uid: string
    name: string
    email?: string
    role: "user" | "lab_manager" | "admin"
  }
}
