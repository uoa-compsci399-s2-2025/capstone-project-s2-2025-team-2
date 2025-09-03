import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
  UserCredential,
} from "firebase/auth"
import { auth } from "../config/firebase"
import FirebaseSignUpRequestDto from "../models/request-models/FirebaseSignUpRequestDto"
import FirebaseSignUpResponseDto from "../models/response-models/FirebaseSignUpResponseDto"
import FirebaseSignInRequestDto from "../models/request-models/FirebaseSignInRequestDto"
import FirebaseSignInResponseDto from "../models/response-models/FirebaseSignInResponseDto"

//            function: firebaseSignUp           //
export const firebaseSignUp = async (
  requestBody: FirebaseSignUpRequestDto,
): Promise<FirebaseSignUpResponseDto> => {
  if (!auth) {
    return {
      success: false,
      message: "Firebase is not initialized. Please check your configuration.",
    }
  }

  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      requestBody.email,
      requestBody.password,
    )

    const user: User = userCredential.user

    const responseBody: FirebaseSignUpResponseDto = {
      success: true,
      message: "User created successfully",
      uid: user.uid,
      email: user.email || undefined,
    }

    return responseBody
  } catch (error: any) {
    console.error("Firebase sign up error:", error)

    let errorMessage = "Sign up failed"
    if (error.code === "auth/email-already-in-use") {
      errorMessage =
        "This email is already registered. Please use a different email or try signing in."
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address format."
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak. Please choose a stronger password."
    }

    const responseBody: FirebaseSignUpResponseDto = {
      success: false,
      message: errorMessage,
    }

    return responseBody
  }
}

//            function: firebaseSignIn           //
export const firebaseSignIn = async (
  requestBody: FirebaseSignInRequestDto,
): Promise<FirebaseSignInResponseDto> => {
  if (!auth) {
    return {
      success: false,
      message: "Firebase is not initialized. Please check your configuration.",
    }
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      requestBody.email,
      requestBody.password,
    )

    console.log("Firebase sign in response:", userCredential)

    const user: User = userCredential.user

    const responseBody: FirebaseSignInResponseDto = {
      success: true,
      message: "Login successful",
      uid: user.uid,
      email: user.email || undefined,
    }

    return responseBody
  } catch (error: any) {
    console.error("Firebase sign in error:", error)

    let errorMessage = "Login failed"
    if (error.code === "auth/user-not-found") {
      errorMessage = "User not found. Please check your email or sign up."
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "Incorrect password. Please try again."
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address format."
    } else if (error.code === "auth/user-disabled") {
      errorMessage = "This account has been disabled."
    }

    const responseBody: FirebaseSignInResponseDto = {
      success: false,
      message: errorMessage,
    }

    return responseBody
  }
}

//            function: firebaseSignOut           //
export const firebaseSignOut = async (): Promise<void> => {
  if (!auth) {
    console.warn("Firebase is not initialized. Cannot sign out.")
    return
  }

  try {
    await signOut(auth)
  } catch (error) {
    console.error("Firebase sign out error:", error)
    throw error
  }
}

//            function: getCurrentUser           //
export const getCurrentUser = (): User | null => {
  return auth?.currentUser || null
}

//            function: getIdToken           //
export const getIdToken = async (): Promise<string | null> => {
  const user = getCurrentUser()
  if (user) {
    return await user.getIdToken()
  }
  return null
}
