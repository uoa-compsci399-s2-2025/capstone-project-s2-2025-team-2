"use client"

import Button from "../../components/generic/button/regular/Button"  
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"

interface SignUpPasswordSectionProps {
  password: string
  confirmPassword: string
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSignUp: () => void
  onSignInClick: () => void
}

//            function: SignUpPasswordSection           //
export default function SignUpPasswordSection({
  password, confirmPassword,
  onPasswordChange, onConfirmPasswordChange, 
  onSignUp, onSignInClick
}: SignUpPasswordSectionProps) {
  //            render: SignUpPasswordSection           //
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="space-y-4">
        <AuthInputBox id="password" name="password" type="password" label="Password" placeholder="Enter your password"
          value={password}
          onChange={onPasswordChange}
          required
        />

        <AuthInputBox id="confirmPassword" name="confirmPassword" type="password" label="Confirm Password" placeholder="Confirm your password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          required
        />
      </div>

      <div className="mt-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex space-x-3">
        <Button type="button" label="Confirm" size="small"
          onClick={onSignUp}
        />
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
