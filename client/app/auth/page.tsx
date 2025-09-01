"use client"

import AuthWelcomeBox from "../components/auth/AuthWelcomeBox"
import SignInBox from "./components/SignInBox"

//            function: AuthPage           //
export default function AuthPage() {

  //            render: AuthPage           //
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 max-w-6xl w-full justify-center">
        {/* Left side - Welcome Box */}
        <AuthWelcomeBox />
        {/* Right side - Sign In Box */}
        <SignInBox />
      </div>
    </div>
  )
}
