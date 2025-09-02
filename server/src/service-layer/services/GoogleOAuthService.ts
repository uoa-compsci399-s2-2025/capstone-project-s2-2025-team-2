import { OAuth2Client } from "google-auth-library"
import { auth, db } from "../../business-layer/security/Firebase"
import type { UserRecord } from "firebase-admin/auth"
import { GoogleOAuthResponse } from "../dtos/response-models/OAuthVerifyResponse"
import GoogleOAuthUser from "../../business-layer/models/GoogleOAuthUser"

export default class GoogleOAuthService {
  private oauth2Client: OAuth2Client

  constructor() {
    this.oauth2Client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    )
  }

  /**
   * Verifies Google ID token and returns user information.
   */
  public async verifyGoogleToken(idToken: string): Promise<any> {
    try {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()
      if (!payload) {
        throw new Error("Invalid token payload")
      }

      return {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      }
    } catch (error) {
      console.error("Google token verification failed:", error)
      throw new Error("Invalid Google token")
    }
  }

  /**
   * Returns New Zealand time.
   */
  private getNewZealandTime(): Date {
    return new Date(
      new Date().toLocaleString("en-US", { timeZone: "Pacific/Auckland" }),
    )
  }

  /**
   * Saves user data to Firestore.
   */
  private async saveUserToFirestore(
    uid: string,
    email: string,
    displayName?: string,
  ): Promise<void> {
    try {
      const userData = {
        email: email,
        displayName: displayName || "",
        createdAt: this.getNewZealandTime(),
      }

      await db.collection("users").doc(uid).set(userData)
      console.log(`User data saved to Firestore for UID: ${uid}`)
    } catch (error) {
      console.error("Error saving user to Firestore:", error)
      throw new Error("Failed to save user data to database")
    }
  }

  /**
   * Creates or updates Firebase user with Google user information.
   */
  public async createOrUpdateUser(googleUserInfo: any): Promise<UserRecord> {
    try {
      // Check for existing user
      let userRecord: UserRecord
      let isNewUser = false

      try {
        // Check existing user by email
        userRecord = await auth.getUserByEmail(googleUserInfo.email)

        console.log(`Existing user found: ${userRecord.uid}`)

        // Update existing user information
        await auth.updateUser(userRecord.uid, {
          displayName: googleUserInfo.name,
          photoURL: googleUserInfo.picture,
        })

        // Ensure user document exists in Firestore
        try {
          const userDocRef = db.collection("users").doc(userRecord.uid)
          const userDoc = await userDocRef.get()

          if (userDoc.exists) {
            // Document exists, update it
            await userDocRef.update({
              displayName: googleUserInfo.name,
              updatedAt: this.getNewZealandTime(),
            })
            console.log(
              `Updated existing Firestore document for UID: ${userRecord.uid}`,
            )
          } else {
            // Document doesn't exist, create it (this should not happen for existing users)
            console.warn(
              `Firestore document missing for existing user UID: ${userRecord.uid}, creating it now`,
            )
            await userDocRef.set({
              email: googleUserInfo.email,
              displayName: googleUserInfo.name,
              createdAt: this.getNewZealandTime(),
            })
            console.log(
              `Created missing Firestore document for existing user UID: ${userRecord.uid}`,
            )
          }
        } catch (firestoreError) {
          console.error(
            "Failed to handle Firestore document for existing user:",
            firestoreError,
          )
          // Even if Firestore fails, we should continue with the user
        }
      } catch (error: any) {
        // User not found (new user)
        if (error.code === "auth/user-not-found") {
          console.log(`Creating new user for email: ${googleUserInfo.email}`)

          // Create new user
          userRecord = await auth.createUser({
            email: googleUserInfo.email,
            displayName: googleUserInfo.name,
            photoURL: googleUserInfo.picture,
            emailVerified: true,
          })

          isNewUser = true
        } else {
          // Other errors
          console.error("Unexpected error while checking user:", error)
          throw error
        }
      }

      // Save to Firestore for new users
      if (isNewUser) {
        try {
          await this.saveUserToFirestore(
            userRecord.uid,
            googleUserInfo.email,
            googleUserInfo.name,
          )
          console.log(
            `Successfully created Firestore document for new user UID: ${userRecord.uid}`,
          )
        } catch (firestoreError) {
          console.error("Failed to save new user to Firestore:", firestoreError)
          // This is critical for new users, so we should handle it appropriately
          throw new Error("Failed to save user data to database")
        }
      }

      return userRecord
    } catch (error) {
      console.error("Error creating/updating user:", error)
      throw new Error("Failed to create/update user")
    }
  }

  /**
   * Creates Firebase custom token for user ID.
   */
  public async createCustomToken(uid: string): Promise<string> {
    try {
      return await auth.createCustomToken(uid)
    } catch (error) {
      console.error("Error creating custom token:", error)
      throw new Error("Failed to create custom token")
    }
  }

  /**
   * Verifies Google ID token and authenticates user.
   */
  public async verifyTokenAndAuthenticate(
    idToken: string,
  ): Promise<GoogleOAuthResponse> {
    try {
      // Verify Google ID token
      const googleUserInfo = await this.verifyGoogleToken(idToken)

      // Create or update Firebase user
      const userRecord = await this.createOrUpdateUser(googleUserInfo)

      // Create custom token
      const customToken = await this.createCustomToken(userRecord.uid)

      const user: GoogleOAuthUser = {
        uid: userRecord.uid,
        email: userRecord.email || "",
        displayName: userRecord.displayName || undefined,
        photoURL: userRecord.photoURL || undefined,
      }

      const responseBody: GoogleOAuthResponse = {
        success: true,
        message: "Google authentication successful",
        token: customToken,
        user: user,
      }

      return responseBody
    } catch (error) {
      console.error("Google token verification error:", error)
      throw new Error(
        error instanceof Error ? error.message : "Authentication failed",
      )
    }
  }
}
