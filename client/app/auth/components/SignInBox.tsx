"use client"

import Button from "../../components/generic/button/regular/Button"
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthCheckbox from "../../components/auth/AuthCheckbox"
import AuthLink from "../../components/auth/AuthLink"
import AuthText from "../../components/auth/AuthText"
import AuthDivider from "../../components/auth/AuthDivider"
import GoogleOAuthBtn from "../../components/auth/GoogleOAuthBtn"
import AuthNotificationBox, {
  AuthNotificationState,
} from "./AuthNotificationBox"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { firebaseSignIn, getIdToken } from "../../services/firebase-auth"
import FirebaseSignInRequestDto from "../../models/request-models/FirebaseSignInRequestDto"
import FirebaseSignInResponseDto from "../../models/response-models/FirebaseSignInResponseDto"
import { verifyToken } from "../../services/auth"
import { toast } from "sonner"

//            function: SignIn           //
export default function SignInBox({
  setAuthType,
}: {
  setAuthType: (authType: "signin" | "signup" | "forgotpassword") => void
}) {
  //            state           //
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [, setUser] = useState<any>(null)
  const [, setIsAuthenticated] = useState(false)
  const [notificationState, setNotificationState] =
    useState<AuthNotificationState>("not-displaying")

  //            function: handleSignUp           //
  const handleSignUpClick = () => {
    setAuthType("signup")
  }

  //            function: handleForgotPasswordClick           //
  const handleForgotPasswordClick = () => {
    setAuthType("forgotpassword")
  }

  //            function: handleGoogleSuccess           //
  const handleGoogleSuccess = async (userData: any) => {
    console.log("Google OAuth success:", userData)
    setUser(userData)
    setIsAuthenticated(true)

    // Store ID token in localStorage for Google OAuth
    try {
      const idToken = await getIdToken()
      if (idToken) {
        localStorage.setItem("authToken", idToken)
        console.log("Google OAuth ID Token stored in localStorage")
      }
    } catch (error) {
      console.error("Error storing Google OAuth token:", error)
    }
    //welcome toast, redirect to marketplace
    toast(`Welcome, ${userData.displayName || userData.email}!`)
    router.push("/marketplace")
  }

  //            function: handleGoogleError           //
  const handleGoogleError = (error: any) => {
    if (error.message !== "Please use an accepted institutional email") {
      console.error("Google OAuth error:", error)
    }
    toast.error(error.message)
  }

  //            function: handleSubmit           //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setNotificationState("signing-in")
      const requestBody: FirebaseSignInRequestDto = { email, password }
      console.log("Signing in with Firebase:", { email, password })
      const response = await firebaseSignIn(requestBody)
      handleSignInResponse(response)
    } catch (error) {
      console.error("Error during sign in:", error)
      setNotificationState("login-fail")
    }
  }

  //            function: handleSignInResponse           //
  const handleSignInResponse = async (response: FirebaseSignInResponseDto) => {
    if (response.success) {
      setNotificationState("login-success")
      setUser({ uid: response.uid, email: response.email })
      setIsAuthenticated(true)
      console.log("User signed in:", {
        uid: response.uid,
        email: response.email,
      })

      // Store ID token in localStorage
      try {
        const idToken = await getIdToken()
        if (idToken) {
          localStorage.setItem("authToken", idToken)
          console.log("ID Token stored in localStorage")
        }
      } catch (error) {
        console.error("Error storing token:", error)
      }

      // Ensure user data exists in Firestore
      await ensureUserInFirestore()

      //welcome toast, redirect to marketplace
      toast(`Welcome back, ${response.email}!`)
      router.push("/marketplace")
    } else {
      setNotificationState("login-fail")
    }
  }

  //            function: ensureUserInFirestore           //
  const ensureUserInFirestore = async () => {
    try {
      const response = await verifyToken()

      if (response && response.success) {
        console.log("User data verified in Firestore:", response)
      } else {
        console.error("Failed to verify user in Firestore:", response)
      }
    } catch (error) {
      console.error("Error verifying user in Firestore:", error)
    }
  }

  //            render: SignIn           //
  return (
    <div className="max-w-md min-w-full w-full md:min-w-0 space-y-8 p-4 bg-primary rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="text-left md:text-center mb-12 md:mb-8">
        <h2 className="text-2xl md:text-3xl">Sign In</h2>
        <p className="mt-2 text-secondary">Sign in to your account</p>
      </div>

      <AuthNotificationBox state={notificationState} />

      {/* Shared container for button/field width*/}
      <div className="w-full max-w-[400px] mx-auto">
        {/* Google OAuth Button */}
        <div className="w-full flex mb-6 md:mb-8">
          {/* 1. Google OAuth Button Rendering */}
          {/* 2. Pass call back functions into the GoogleOAuthBtn component */}
          <GoogleOAuthBtn
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>

        {/* Divider */}
        <AuthDivider text="or use your account" />

        {/* Form Section */}
        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          {/* 1. Input Fields */}
          <div className="space-y-4">
            <AuthInputBox
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AuthInputBox
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 2. Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <AuthCheckbox
              id="remember-me"
              name="remember-me"
              label="Remember me"
            />
            <AuthLink onClick={handleForgotPasswordClick}>
              Forgot your password?
            </AuthLink>
          </div>

          {/* 3. Submit Button */}
          <div className="flex justify-center w-full">
            <Button
              type="submit"
              label="Sign In"
              textSize="text-sm"
              className="justify-center w-full"
            />
          </div>

          {/* 4. Sign Up Link */}
          <AuthText className="text-center">
            Don&apos;t have an account?{" "}
            <AuthLink onClick={handleSignUpClick}>Sign up</AuthLink>
          </AuthText>
        </form>
      </div>
    </div>
  )
}
