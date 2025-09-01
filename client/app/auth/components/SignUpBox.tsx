"use client"

import { useState } from "react"
import SignUpEmailSection from "./SignUpEmailSection"
import SignUpPasswordSection from "./SignUpPasswordSection"
import SendVerificationCodeRequestDto from "../../models/request-models/sendVerificationCodeRequestDto"
import SendVerificationCodeResponseDto from "../../models/response-models/sendVerificationCodeResponseDto"
import { sendVerificationCode } from "../../services/auth"

//            function: SignUpBox           //
export default function SignUpBox({ setAuthType }: { setAuthType: (authType: "signin" | "signup" | "forgotpassword") => void }) {
  //            state           //
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)

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
  const handleSendVerificationCodeResponse = (response: any) => {
    console.log("Response:", response)
    if (response.error) {
      alert("Failed to send verification code. Please try again.")
      return
    }
    
    const responseData: SendVerificationCodeResponseDto = response.data
    if (responseData.success) {
      alert("Verification code sent to your email!")
    } else {
      alert("Failed to send verification code. Please try again.")
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
      <div className="text-center mb-8">
        <h2>Sign Up</h2>
        <p className="mt-2 text-secondary">Create your account</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-primary' : 'bg-muted'}`}></div>
        <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-primary' : 'bg-muted'}`}></div>
      </div>

      {currentStep === 1 ? (
        <SignUpEmailSection
          email={email}
          verificationCode={verificationCode}
          isEmailValid={isEmailValid}
          onEmailChange={handleEmailChange}
          onVerificationCodeChange={(e) => setVerificationCode(e.target.value)}
          onVerifyEmail={onClickSendVerificationCode}
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
