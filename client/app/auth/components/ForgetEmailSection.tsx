"use client"

import Button from "../../components/generic/button/regular/Button"
import DisabledButton from "../../components/generic/button/disabled/DisabledButton"

import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"
import { useEffect, useState } from "react"
import { useEmailValidation } from "../../hooks/useSignupEmailValidation"
import SendVerificationCodeRequestDto from "../../models/request-models/SendVerificationCodeRequestDto"
import SendVerificationCodeResponseDto from "../../models/response-models/SendVerificationCodeResponseDto"
import { sendVerificationCode, verifyCode } from "../../services/auth"
import VerifyCodeRequestDto from "../../models/request-models/VerifyCodeRequestDto"
import VerifyCodeResponseDto from "../../models/response-models/VerifyCodeResponseDto"
import AuthNotificationBox, {
  AuthNotificationState,
} from "./AuthNotificationBox"

interface ForgetEmailSectionProps {
  onNextStep: (email: string, verificationCode: string) => void
  onSignInClick: () => void
}

//            function: ForgetEmailSection           //
export default function ForgetEmailSection({
  onNextStep,
  onSignInClick,
}: ForgetEmailSectionProps) {
  //            state           //
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false)
  const [notificationState, setNotificationState] =
    useState<AuthNotificationState>("not-displaying")
  const {
    validateEmail,
    isValid: isUserEmailDomainValid,
    errorMessage: emailDomainErrorMessage,
  } = useEmailValidation()

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
  const handleSendVerificationCodeResponse = (
    response: SendVerificationCodeResponseDto,
  ) => {
    if (response.success) {
        console.log("Verification code sent successfully")
      setNotificationState("sent")
    } else {
      console.log("Failed to send verification code")
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

  useEffect(() => {
    if (verificationCode.length >= 4) {
      setIsVerificationCodeValid(true)
    } else {
      setIsVerificationCodeValid(false)
    }
  }, [verificationCode])

  // validate email in real-time as user types
  useEffect(() => {
    if (email) validateEmail(email)
  }, [email, validateEmail])

  //            render: ForgetEmailSection           //
  return (
    <div className="flex flex-col flex-1 justify-between">
      <AuthNotificationBox state={notificationState} />

      {/* Email Input and Verify Button */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email
          </label>
          <div className="mt-1 flex space-x-2">
            <div className="flex-1">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className={`flex-1 w-full px-3 py-2 border rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors ${
                  email && !isUserEmailDomainValid
                    ? "border-red-500"
                    : email && isUserEmailDomainValid
                      ? "border-green-500"
                      : "border-muted"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {email.length === 0 ? (
              <DisabledButton
                label="Verify"
                textSize="text-sm"
                className={`!w-[92px] flex justify-center items-center`}
              />
            ) : (
              <Button
                onClick={onClickSendVerificationCode}
                label="Verify"
                textSize="text-sm"
                className={`!w-[92px] flex justify-center items-center`}
              />
            )}
          </div>
        </div>
        {/* real-time valiadtion feedback based on zod schemas errors */}
        {email && (
          <div className="mt-1">
            {isUserEmailDomainValid ? (
              <p className="text-sm text-green-400">
                Valid institutional email
              </p>
            ) : emailDomainErrorMessage ? (
              <p className="text-sm text-red-400">{emailDomainErrorMessage}</p>
            ) : null}
          </div>
        )}

        {/* Verification Code Input */}
        <div>
          <label
            htmlFor="verificationCode"
            className="block text-sm font-medium text-white"
          >
            Verification Code
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="flex-1 px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
              placeholder="Enter your verification code"
            />
            {!isVerificationCodeValid ? (
              <DisabledButton
                label="Validate"
                textSize="text-sm"
                className={`!w-[92px]`}
              />
            ) : (
              <Button
                onClick={onClickValidateCode}
                label="Validate"
                textSize="text-sm"
                className={`!w-[92px] flex justify-center items-center`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-6">
        {/* Next Step Button */}
        <div className="flex justify-center w-full">
          {notificationState !== "validated" ||
          !isEmailValid  ? (
            <DisabledButton
              label="Next Page"
              textSize="text-sm"
              className="justify-center w-full"
            />
          ) : (
            <Button
              type="button"
              label="Next Page"
              textSize="text-sm"
              onClick={() => onNextStep(email, verificationCode)}
              className="flex justify-center items-center w-full"
            />
          )}
        </div>
      </div>
    </div>
  )
}
