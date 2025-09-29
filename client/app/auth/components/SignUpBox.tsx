"use client"

import { useState } from "react"
import SignUpEmailSection from "./SignUpEmailSection"
import SignUpPasswordSection from "./SignUpPasswordSection"
import SignUpPersonalSection from "./SignUpPersonalSection"
import AuthNotificationBox, {
  AuthNotificationState,
} from "./AuthNotificationBox"
import SendVerificationCodeRequestDto from "../../models/request-models/SendVerificationCodeRequestDto"
import SendVerificationCodeResponseDto from "../../models/response-models/SendVerificationCodeResponseDto"
import { sendVerificationCode, verifyCode } from "../../services/auth"

import VerifyCodeRequestDto from "../../models/request-models/VerifyCodeRequestDto"
import VerifyCodeResponseDto from "../../models/response-models/VerifyCodeResponseDto"
import { firebaseSignUp } from "../../services/firebase-auth"
import FirebaseSignUpRequestDto from "../../models/request-models/FirebaseSignUpRequestDto"
import FirebaseSignUpResponseDto from "../../models/response-models/FirebaseSignUpResponseDto"
import { verifyToken } from "../../services/auth"
import { useRouter } from "next/navigation"

//            function: SignUpBox           //
export default function SignUpBox({
  setAuthType,
}: {
  setAuthType: (authType: "signin" | "signup" | "forgotpassword") => void
}) {
  //            state           //
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [preferredName, setPreferredName] = useState("")
  const [university, setUniversity] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [notificationState, setNotificationState] =
    useState<AuthNotificationState>("not-displaying")
  const router = useRouter()

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

  //            function: handlePreferredNameChange           //
  const handlePreferredNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setPreferredName(e.target.value)
  }

  //            function: handleUniversityChange           //
  const handleUniversityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUniversity(e.target.value)
  }

  //            function: onVerifyEmail           //
  const onClickSendVerificationCode = () => {
    setNotificationState("sending")
    const requestBody: SendVerificationCodeRequestDto = { email }
    console.log("Sending verification code to:", email)
    sendVerificationCode(requestBody).then(handleSendVerificationCodeResponse)
  }

  //            function: handleSendVerificationCodeResponse           //
  const handleSendVerificationCodeResponse = (
    response: SendVerificationCodeResponseDto,
  ) => {
    if (response.success) {
      setNotificationState("sent")
    } else {
      setNotificationState("sending-fail")
    }
  }

  //            function: onClickVerifyCode           //
  const onClickValidateCode = () => {
    const requestBody: VerifyCodeRequestDto = {
      email,
      inputCode: verificationCode,
    }
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
    if (currentStep === 1) {
      if (email && verificationCode) {
        setNotificationState("not-displaying")
        setCurrentStep(2)
      } else {
        alert("Please fill in all required fields.")
      }
    } else if (currentStep === 2) {
      if (preferredName && university) {
        setCurrentStep(3)
      } else {
        alert("Please fill in all required fields.")
      }
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
      setNotificationState("signing-up")
      const requestBody: FirebaseSignUpRequestDto = {
        email,
        password,
        preferredName,
        university,
      }
      console.log("Signing up with Firebase:", {
        email,
        password,
        preferredName,
        university,
      })
      const response = await firebaseSignUp(requestBody)
      handleSignUpResponse(response)
    } catch (error) {
      console.error("Error during sign up:", error)
      setNotificationState("sign-up-fail")
    }
  }

  //            function: handleSignUpResponse           //
  const handleSignUpResponse = async (response: FirebaseSignUpResponseDto) => {
    if (response.success) {
      setNotificationState("sign-up-success")

      //save user to firestore
      await saveUserToFirestore()

      //welcome alert, mmarketplace redirect
      alert(
        `Welcome, ${preferredName || response.email}! Your account has been created successfully.`,
      )
      router.push("/marketplace")

      // User is automatically signed in after successful sign up
      console.log("User created and signed in:", {
        uid: response.uid,
        email: response.email,
        preferredName,
        university,
      })
    } else {
      setNotificationState("sign-up-fail")
    }
  }

  //            function: saveUserToFirestore           //
  const saveUserToFirestore = async () => {
    try {
      const response = await verifyToken(preferredName, university)

      if (response && response.success) {
        console.log(
          "User data saved to Firestore with personal information:",
          response,
        )
      } else {
        console.error("Failed to save user to Firestore:", response)
      }
    } catch (error) {
      console.error("Error saving user to Firestore:", error)
    }
  }

  //            render: SignUpBox           //
  return (
    <div className="max-w-md min-w-full w-full md:min-w-0 p-4 bg-primary rounded-lg shadow-lg min-h-[600px] flex flex-col">
      {/* Header Section */}
      <div className="text-left md:text-center mb-4">
        <h2 className="text-2xl md:text-3xl">Sign Up</h2>
        <p className="mt-2 text-secondary">Create your account</p>
      </div>

      <AuthNotificationBox state={notificationState} />

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
      ) : currentStep === 2 ? (
        <SignUpPersonalSection
          preferredName={preferredName}
          university={university}
          onPreferredNameChange={handlePreferredNameChange}
          onUniversityChange={handleUniversityChange}
          onNextStep={handleNextStep}
          onSignInClick={handleSignInClick}
        />
      ) : (
        <SignUpPasswordSection
          password={password}
          confirmPassword={confirmPassword}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
          onSignUp={handleSignUp}
          onSignInClick={handleSignInClick}
        />
      )}
    </div>
  )
}
