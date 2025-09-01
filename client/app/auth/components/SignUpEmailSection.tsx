"use client"

import Button from "../../components/generic/button/regular/Button"
import DisabledButton from "../../components/generic/button/disabled/DisabledButton"
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"
import { sendVerificationCode } from "../../services/auth"
import SendVerificationCodeResponseDto from "../../models/response-models/sendVerificationCodeResponseDto"
import SendVerificationCodeRequestDto from "../../models/request-models/sendVerificationCodeRequestDto"

interface SignUpEmailSectionProps {
  email: string
  verificationCode: string
  isEmailValid: boolean
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVerificationCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onVerifyEmail: () => void
  onNextStep: () => void
  onSignInClick: () => void
}

//            function: SignUpEmailSection           //
export default function SignUpEmailSection({
  email, verificationCode, isEmailValid,
  onEmailChange, onVerificationCodeChange, onVerifyEmail,
  onNextStep, onSignInClick
}: SignUpEmailSectionProps) {


  //            function: onVerifyEmail           //
  const onClickSendVerificationCode = () => {
    const requestBody: SendVerificationCodeRequestDto = { email }
    sendVerificationCode(requestBody).then(handleSendVerificationCodeResponse)
  }

  //            function: handleSendVerificationCodeResponse           //
  const handleSendVerificationCodeResponse = (response: any) => {
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

  //            render: SignUpEmailSection           //
  return (
    <div className="flex flex-col flex-1 justify-between">
      {/* Email Input and Verify Button */}
      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white">
            Email
          </label>
          <div className="mt-1 flex space-x-2">
            <input id="email" name="email" type="email" required
              value={email}
              onChange={onEmailChange}
              className="flex-1 px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
              placeholder="Enter your email"
            />
            {(!isEmailValid) ? (
            <DisabledButton label="Verify" size="small" className={`!w-[85px]`} />
            ):(
            <Button onClick={onClickSendVerificationCode} label="Verify" size="small" className={`!w-[85px]`} />
            )}
          </div>
        </div>

        <AuthInputBox id="verificationCode" name="verificationCode" type="text" label="Verification Code" placeholder="Enter verification code"
          value={verificationCode}
          onChange={onVerificationCodeChange}
          required
        />
      </div>

      <div className="mt-auto space-y-6">
      {/* Next Step Button */}
      <div className="flex justify-center w-full">
        <Button type="button" label="Next Page" size="small" onClick={onNextStep} />
      </div>

      {/* Sign In Link */}
      <AuthText className="text-center">
        Already have an account?{" "}
        <AuthLink onClick={onSignInClick} children="Sign in" />
      </AuthText>
      </div>
    </div>
  )
}
