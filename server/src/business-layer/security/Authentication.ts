import FireBaseError from "../../business-layer/errors/FirebaseError"
import { StatusCodes } from "http-status-codes"
import { auth } from "./Firebase"
import { UserService } from "../../data-layer/repositories/UserRepository"
import { AuthRequest } from "service-layer/dtos/request/AuthRequest"

export function expressAuthentication(
  request: AuthRequest,
  securityName: string,
  scopes?: string[],
) {
  if (securityName === "jwt") {
    const authHeader = String(request.headers.authorization || "")

    return new Promise((resolve, reject) => {
      if (!authHeader.startsWith("Bearer ")) {
        reject(new Error("No token provided"))
      }

      const token = authHeader.split(" ")[1] // Gets part after Bearer

      auth
        .verifyIdToken(token)
        .then((decodedToken) => {
          const { uid } = decodedToken
          auth
            .getUser(uid)
            .then(async (user) => {
              for (const scope of scopes) {
                if (user.customClaims === undefined) {
                  throw new FireBaseError(
                    "Authentication Error",
                    StatusCodes.UNAUTHORIZED,
                    "No Scope",
                  )
                }
                if (
                  !(scope in user.customClaims) ||
                  !user.customClaims[scope]
                ) {
                  throw new FireBaseError(
                    "Authentication Error",
                    StatusCodes.UNAUTHORIZED,
                    "No Scope",
                  )
                }
              }
              let role: "user" | "lab_manager" | "admin" = "user"
              try {
                const userService = new UserService()

                // this function needs to be written
                const userFromDB = await userService.getUserById(uid)

                if (userFromDB && userFromDB.role) {
                  role = userFromDB.role
                  console.log(`User ${user.uid} has role: ${role}`)
                } else {
                  console.log(
                    `User ${user.uid} not found in database, using default role: user`,
                  )
                }
              } catch (dbError) {
                console.log(
                  "Failed to fetch user role from database, using default 'user'",
                  dbError,
                )
              }
              request.user = {
                uid: uid,
                role: role,
                email: user.email,
                name: user.displayName || null,
              }
              console.log("authentication successful:", request.user)
              resolve(request.user)
            })
            .catch((reason) => {
              if (!(reason instanceof FireBaseError)) {
                console.error(reason)
              }
              reject(
                new FireBaseError(
                  "Authentication Error",
                  StatusCodes.UNAUTHORIZED,
                  reason,
                ),
              )
            })
        })
        .catch((reason) => {
          if (!(reason instanceof FireBaseError)) {
            console.error(reason)
          }
          reject(
            new FireBaseError(
              "Authentication Error",
              StatusCodes.UNAUTHORIZED,
              reason,
            ),
          )
        })
    })
  }
  return Promise.reject(new Error("Unknown Error"))
}
