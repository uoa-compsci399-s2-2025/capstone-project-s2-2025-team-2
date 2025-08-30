import { auth } from "../../business-layer/security/Firebase";
import type { Request } from "express";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
  response?:any
): Promise<any> {
  if (securityName === "jwt") {
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      throw { status: 401, message: "No Authorization header" };
    }
    const token = authHeader.replace(/^Bearer\s/, "");
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return decodedToken; 
    } catch (err) {
      throw { status: 401, message: "Invalid or expired token" };
    }
  }
  throw { status: 401, message: "Unknown security name" };
}