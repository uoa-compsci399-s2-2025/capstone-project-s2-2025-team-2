"use client"

import { useState } from "react"
import SignUpEmailSection from "./SignUpEmailSection"
import SignUpPasswordSection from "./SignUpPasswordSection"
import SendVerificationCodeRequestDto from "../../models/request-models/sendVerificationCodeRequestDto"
import SendVerificationCodeResponseDto from "../../models/response-models/sendVerificationCodeResponseDto"
import { sendVerificationCode, verifyCode } from "../../services/auth"
import VerifyCodeRequestDto from "@/app/models/request-models/verifyCodeRequestDto"
import VerifyCodeResponseDto from "@/app/models/response-models/VerifyCodeResponseDto"

//            function: SignUpBox           //
export default function SignUpBox({ setAuthType }: { setAuthType: (authType: "signin" | "signup" | "forgotpassword") => void }) {
  //            state           //
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isVerificationCodeSent, setIsVerificationCodeSent] = useState<boolean | null>(null)
  const [isVerificationSuccess, setIsVerificationSuccess] = useState<boolean | null>(null)

  //            function: handleSignInClick           //
  const handleSignInClick = () => {
    setAuthType("signin")
  }

  //            function: handleEmailChange           //
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(emailValue))
  }

  //            function: onVerifyEmail           //
  const onClickSendVerificationCode = () => {
    const requestBody: SendVerificationCodeRequestDto = { email }
    console.log("Sending verification code to:", email)
    sendVerificationCode(requestBody).then(handleSendVerificationCodeResponse)
  }

  //            function: handleSendVerificationCodeResponse           //
  const handleSendVerificationCodeResponse = (response: SendVerificationCodeResponseDto) => {
    if (response.success) {
      setIsVerificationCodeSent(true)
    } else {
      setIsVerificationCodeSent(false)
    }
  }

    //            function: onClickVerifyCode           //
    const onClickValidateCode = () => {
        const requestBody: VerifyCodeRequestDto = { email, inputCode: verificationCode }
        console.log("Verifying code for:", email)
        verifyCode(requestBody).then(handleValidateCodeResponse)
    }

    //            function: handleVerifyCodeResponse           //
    const handleValidateCodeResponse = (response: VerifyCodeResponseDto) => {
      if (response.success) {
        setIsVerificationCodeSent(null)
        setIsVerificationSuccess(true)
      } else {
        setIsVerificationCodeSent(null)
        setIsVerificationSuccess(false)
      }
    }

  //            function: handleNextStep           //
  const handleNextStep = () => {
    if (email && verificationCode) {
      setCurrentStep(2)
    } else {
    //   alert("Please fill in all required fields.")
    setCurrentStep(2)
    }
  }

  //            function: handleSignUp           //
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }

    try {
      // TODO: Implement sign up logic
      console.log("Signing up with:", { email, password })
      alert("Sign up successful!")
    } catch (error) {
      console.error("Error during sign up:", error)
      alert("Sign up failed. Please try again.")
    }
  }

  //            function: handleBackToStep1           //
  const handleBackToStep1 = () => {
    setCurrentStep(1)
  }

  //            render: SignUpBox           //
  return (
    <div className="max-w-md w-full p-8 bg-primary rounded-lg shadow-lg min-h-[600px] flex flex-col">
      {/* Header Section */}
      <div className="text-center mb-4">
        <h2>Sign Up</h2>
        <p className="mt-2 text-secondary">Create your account</p>
      </div>

      { /* TODO: remove dupilicate code */ }
      {isVerificationCodeSent && (
        <div className="mb-6 p-4 bg-blue-500 border border-blue-500 text-blue-700 rounded">
          <p className="font-medium">
            Verification code sent to your email!
          </p>
        </div>
      )}

      {isVerificationCodeSent === false && (
        <div className="mb-6 p-4 bg-red-500 border border-red-500 text-red-700 rounded">
          <p className="font-medium">
            Failed to send verification code. Please try again.
          </p>
        </div>
      )}

      {isVerificationSuccess && (
        <div className="mb-6 p-4 bg-green-500 border border-green-500 text-green-700 rounded">
          <p className="font-medium">
            Verification code verified successfully!
          </p>
        </div>
      )}

      {isVerificationSuccess === false && (
        <div className="mb-6 p-4 bg-red-500 border border-red-500 text-red-700 rounded">
          <p className="font-medium">
            Verification code is incorrect. Please try again.
          </p>
        </div>
      )}

      {currentStep === 1 ? (
        <SignUpEmailSection
          email={email}
          verificationCode={verificationCode}
          isEmailValid={isEmailValid}
          onEmailChange={handleEmailChange}
          onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
          onVerifyEmail={onClickSendVerificationCode}
          onValidateCode={onClickValidateCode}
          onNextStep={handleNextStep}
          onSignInClick={handleSignInClick}
        />
      ) : (
        <SignUpPasswordSection
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onBackToStep1={handleBackToStep1}
          onSignUp={handleSignUp}
          onSignInClick={handleSignInClick}
        />
      )}
    </div>
  )
}
