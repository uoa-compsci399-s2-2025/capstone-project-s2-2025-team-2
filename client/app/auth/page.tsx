"use client"

import { useState } from "react"
import AuthWelcomeBox from "../components/auth/AuthWelcomeBox"
import SignInBox from "./components/SignInBox"
import SignUpBox from "./components/SignUpBox"

//            function: AuthPage           //
export default function AuthPage() {
  const [authType, setAuthType] = useState<
    "signin" | "signup" | "forgotpassword"
  >("signin")

  //            render: AuthPage           //
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 max-w-6xl w-full justify-center">
        {/* Left side - Welcome Box */}
        <AuthWelcomeBox />
        {/* Right side - Sign In Box */}
        {authType === "signin" ? (
          <SignInBox setAuthType={setAuthType} />
        ) : (
          <SignUpBox setAuthType={setAuthType} />
        )}
      </div>
    </div>
  )
}
