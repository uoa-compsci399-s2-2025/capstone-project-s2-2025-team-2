"use client"

import Button from "../components/generic/button/regular/Button"
import AuthInputBox from "../components/auth/AuthInputBox"
import AuthCheckbox from "../components/auth/AuthCheckbox"
import AuthLink from "../components/auth/AuthLink"
import AuthText from "../components/auth/AuthText"
import AuthDivider from "../components/auth/AuthDivider"
import AuthWelcomeBox from "../components/auth/AuthWelcomeBox"
import GoogleOAuthBtn from "../components/auth/GoogleOAuthBtn"
import { useState } from "react"
import client from "../services/fetch-client"
import { useRouter } from "next/navigation"

//            function: AuthPage           //
export default function AuthPage() {
  //            state           //
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  //            function: handleGoogleSuccess           //
  const handleGoogleSuccess = (userData: any) => {
    console.log("Google OAuth success:", userData)
    setUser(userData)
    setIsAuthenticated(true)

    // Show success message
    alert(`Welcome, ${userData.displayName || userData.email}!`)

    // Here you can redirect or handle other actions
    // Example: router.push('/dashboard')
    router.push("/landing")
  }

  //            function: handleGoogleError           //
  const handleGoogleError = (error: any) => {
    console.error("Google OAuth error:", error)
    alert("Google authentication failed. Please try again.")
  }

  //            function: handleSubmit           //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await client.POST("/auth/login", {
        body: { email, password },
      })

      const data = response.data

      if (data && data.success) {
        alert("Login successful!")
        // Here you can redirect or handle other actions
      } else {
        alert("Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("An error occurred during login.")
    }
  }

  //            render: AuthPage           //
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-white to-white/5">
      <div className="md:flex md:gap-8 max-w-6xl w-full justify-center">
        {/* Left side - Sign In Box */}
        <div className="max-w-md w-full space-y-8 p-8 bg-primary rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="text-center">
            <h2>Sign In</h2>
            <p className="mt-2 text-secondary">Sign in to your account</p>
          </div>

          {/* Authentication Status */}
          {isAuthenticated && user && (
            <div className="mt-4 p-4 bg-green-500 border border-green-500 text-green-700 rounded">
              <p className="font-semibold">
                Welcome, {user.displayName || user.email}!
              </p>
              <p className="text-sm">You are now signed in with Google.</p>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="w-full flex justify-center items-center">
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
              <AuthLink href="#" className="text-sm">
                Forgot your password?
              </AuthLink>
            </div>

            {/* 3. Submit Button */}
            <div className="flex justify-center w-full">
              <Button type="submit" label="Sign In" size="small" />
            </div>

            {/* 4. Sign Up Link */}
            <AuthText className="text-center">
              Don&apos;t have an account?{" "}
              <AuthLink href="/auth/signup"> Sign up </AuthLink>
            </AuthText>
          </form>
        </div>

        {/* Right side - Welcome Box */}
        <AuthWelcomeBox />
      </div>
    </div>
  )
}
