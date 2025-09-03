"use client"

import { useState } from "react"
import SignUpEmailSection from "./SignUpEmailSection"
import SignUpPasswordSection from "./SignUpPasswordSection"
import SignUpNotificationBox, { SignUpNotificationState } from "./SignUpNotificationBox"
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
  const [notificationState, setNotificationState] = useState<SignUpNotificationState>("not-displaying")

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
    setNotificationState("sending")
    const requestBody: SendVerificationCodeRequestDto = { email }
    console.log("Sending verification code to:", email)
    sendVerificationCode(requestBody).then(handleSendVerificationCodeResponse)
  }

  //            function: handleSendVerificationCodeResponse           //
  const handleSendVerificationCodeResponse = (response: SendVerificationCodeResponseDto) => {
    if (response.success) {
      setNotificationState("sent")
    } else {
      setNotificationState("sending-fail")
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
        setNotificationState("validated")
      } else {
        setNotificationState("validation-fail")
      }
    }

  //            function: handleNextStep           //
  const handleNextStep = () => {
    if (email && verificationCode) {
      setNotificationState("not-displaying")
      setCurrentStep(2)
    } else {
    //   alert("Please fill in all required fields.")
    setCurrentStep(2)
    }
  }

  //            function: handleSignUp           //
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setNotificationState("password-not-matching")
      return
    }

    if (password.length < 6) {
      setNotificationState("password-not-suitable")
      return
    }

    try {
      // TODO: Implement sign up logic
      console.log("Signing up with:", { email, password })
      alert("Sign up successful!")
    } catch (error) {
      console.error("Error during sign up:", error)
      setNotificationState("sign-up-fail")
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

      <SignUpNotificationBox state={notificationState} />

      {currentStep === 1 ? (
        <SignUpEmailSection
          email={email}
          verificationCode={verificationCode}
          isEmailValid={isEmailValid}
          isVerificationSuccess={notificationState === "validated"}
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
