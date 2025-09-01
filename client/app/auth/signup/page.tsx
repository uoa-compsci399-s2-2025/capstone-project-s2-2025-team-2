"use client"

import AuthWelcomeBox from "../../components/auth/AuthWelcomeBox"
import SignUpBox from "../components/SignUpBox"

//            function: SignUpPage           //
export default function SignUpPage() {
  //            render: SignUpPage           //
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 max-w-6xl w-full justify-center">
        {/* Left side - Welcome Box */}
        <AuthWelcomeBox />
        {/* Right side - Sign Up Box */}
        <SignUpBox />
      </div>
    </div>
  )
}
