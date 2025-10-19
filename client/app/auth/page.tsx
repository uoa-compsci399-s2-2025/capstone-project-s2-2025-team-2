"use client"

import { useState } from "react"
import AuthWelcomeBox from "../components/auth/AuthWelcomeBox"
import SignInBox from "./components/SignInBox"
import SignUpBox from "./components/SignUpBox"
import ForgetEmailSection from "./components/ForgetEmailSection"
import ForgetPasswordSection from "./components/ForgetPasswordSection"

//            function: AuthPage           //
export default function AuthPage() {
  const [authType, setAuthType] = useState<
    "signin" | "signup" | "forgotpassword" | "forgetemail" | "forgetpassword"
  >("signin")

  // Forgot password state
  const [forgetEmail, setForgetEmail] = useState("")

  // Forgot password handlers
  const handleForgetNextStep = (email: string, verificationCode: string) => {
    setForgetEmail(email)
    setAuthType("forgetpassword")
  }

  const handleForgetSignInClick = () => {
    setAuthType("signin")
  }

  //            render: AuthPage           //
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 w-full max-w-6xl justify-center min-h-screen md:min-h-0">
        {/* Left side - Welcome Box */}
        <AuthWelcomeBox />
        {/* Right side - Auth Components */}
        {authType === "signin" ? (
          <SignInBox setAuthType={setAuthType} />
        ) : authType === "signup" ? (
          <SignUpBox setAuthType={setAuthType} />
        ) : authType === "forgetemail" ? (
          <div className="max-w-md min-w-full w-full md:min-w-0 p-4 bg-primary rounded-lg shadow-lg min-h-[600px] flex flex-col">
            <div className="text-left md:text-center mb-4">
              <h2 className="text-2xl md:text-3xl">Reset Password</h2>
              <p className="mt-2 text-secondary">Enter your email to reset your password</p>
            </div>
            <ForgetEmailSection
              onNextStep={handleForgetNextStep}
              onSignInClick={handleForgetSignInClick}
            />
          </div>
        ) : authType === "forgetpassword" ? (
          <div className="max-w-md min-w-full w-full md:min-w-0 p-4 bg-primary rounded-lg shadow-lg min-h-[600px] flex flex-col">
            <div className="text-left md:text-center mb-4">
              <h2 className="text-2xl md:text-3xl">Set New Password</h2>
              <p className="mt-2 text-secondary">Enter your new password</p>
            </div>
            <ForgetPasswordSection
              email={forgetEmail}
              onSignInClick={handleForgetSignInClick}
            />
          </div>
        ) : (
          //route forgot password to sign in for now
          <SignInBox setAuthType={setAuthType} />
        )}
      </div>
    </div>
  )
}
