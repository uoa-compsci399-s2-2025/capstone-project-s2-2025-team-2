"use client"

import Button from "../../components/generic/button/regular/Button"
import DisabledButton from "../../components/generic/button/disabled/DisabledButton"
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"

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
            <DisabledButton label="Verify" size="small" textSize="small" className={`!w-[85px]`} />
            ):(
            <Button onClick={onVerifyEmail} label="Verify" size="small" textSize="small" className={`!w-[85px]`} />
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
