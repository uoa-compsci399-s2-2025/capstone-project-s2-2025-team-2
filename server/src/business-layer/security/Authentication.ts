import FireBaseError from "../../business-layer/errors/FirebaseError"
import type * as express from "express"
import { StatusCodes } from "http-status-codes"
import { auth } from "./Firebase"
import { UserService } from "../../data-layer/repositories/UserRepository"

export function expressAuthentication(
  request: express.Request,
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
            .then((user) => {
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
                const userFromDB = userService.getUserById()

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
              const authUser = {
                user: {
                  uid: user.uid,
                  name: user.displayName,
                  email: user.email,
                  role: role,
                },
              }

              resolve(authUser)
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
