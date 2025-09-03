"use client"

import Button from "../../components/generic/button/regular/Button"
import DisabledButton from "../../components/generic/button/disabled/DisabledButton"

import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"
import { useEffect, useState } from "react"

interface SignUpEmailSectionProps {
  email: string
  verificationCode: string
  isEmailValid: boolean
  isVerificationSuccess: boolean
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVerificationCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVerifyEmail: () => void
  onNextStep: () => void
  onSignInClick: () => void
  onValidateCode: () => void
}

//            function: SignUpEmailSection           //
export default function SignUpEmailSection({
  email,
  verificationCode,
  isEmailValid,
  isVerificationSuccess,
  onEmailChange,
  onVerificationCodeChange,
  onVerifyEmail,
  onNextStep,
  onSignInClick,
  onValidateCode,
}: SignUpEmailSectionProps) {
  const [isVerificationCodeValid, setIsVerificationCodeValid] = useState(false)

  useEffect(() => {
    if (verificationCode.length >= 4) {
      setIsVerificationCodeValid(true)
    } else {
      setIsVerificationCodeValid(false)
    }
  }, [verificationCode])

  //            render: SignUpEmailSection           //
  return (
    <div className="flex flex-col flex-1 justify-between">
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
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={onEmailChange}
              className="flex-1 px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
              placeholder="Enter your email"
            />
            {!isEmailValid ? (
              <DisabledButton
                label="Verify"
                size="small"
                textSize="small"
                className={`!w-[92px]`}
              />
            ) : (
              <Button
                onClick={onVerifyEmail}
                label="Verify"
                size="small"
                textSize="small"
                className={`!w-[92px]`}
              />
            )}
          </div>
        </div>

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
              onChange={onVerificationCodeChange}
              className="flex-1 px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
              placeholder="Enter your verification code"
            />
            {!isVerificationCodeValid ? (
              <DisabledButton
                label="Validate"
                size="small"
                textSize="small"
                className={`!w-[92px]`}
              />
            ) : (
              <Button
                onClick={onValidateCode}
                label="Validate"
                size="small"
                textSize="small"
                className={`!w-[92px]`}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-6">
        {/* Next Step Button */}
        <div className="flex justify-center w-full">
          {!isVerificationSuccess || !isEmailValid ? (
            <DisabledButton label="Next Page" size="small" />
          ) : (
            <Button
              type="button"
              label="Next Page"
              size="small"
              onClick={onNextStep}
            />
          )}
        </div>

        {/* Sign In Link */}
        <AuthText className="text-center">
          Already have an account?{" "}
          <AuthLink onClick={onSignInClick}>Sign in</AuthLink>
        </AuthText>
      </div>
    </div>
  )
}
