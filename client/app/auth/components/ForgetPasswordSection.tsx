"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Button from "../../components/generic/button/regular/Button"
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthNotificationBox, {
  AuthNotificationState,
} from "./AuthNotificationBox"
import { resetPassword } from "../../services/auth"
import ResetPasswordRequestDto from "../../models/request-models/ResetPasswordRequestDto"

interface ForgetPasswordSectionProps {
  email: string
  onSignInClick: () => void
}

//            function: ForgetPasswordSection           //
export default function ForgetPasswordSection({
  email,
  onSignInClick,
}: ForgetPasswordSectionProps) {
  //            state           //
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [notificationState, setNotificationState] =
    useState<AuthNotificationState>("not-displaying")
  const router = useRouter()

  //            function: handlePasswordReset           //
  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setNotificationState("password-not-matching")
      return
    }

    if (password.length < 6) {
      setNotificationState("password-not-suitable")
      return
    }

    try {
      setNotificationState("setting-forget-password")

      const requestBody: ResetPasswordRequestDto = {
        email,
        newPassword: password,
      }

      console.log("Resetting password:", { email })
      const response = await resetPassword(requestBody)
      console.log("Reset password response:", response)

      if (response.success) {
        setNotificationState("forget-password-success")
        setTimeout(() => {
          onSignInClick()
        }, 2000)
      } else {
        // Check if it's a Google OAuth user error
        if (
          response.message &&
          response.message.includes(
            "Google sign-in users cannot change their password",
          )
        ) {
          setNotificationState("google-oauth-password-reset-not-allowed")
          // Redirect to /auth after 2 seconds
          setTimeout(() => {
            router.push("/auth")
          }, 2000)
        } else {
          setNotificationState("forget-password-fail")
        }
      }
    } catch (error) {
      console.error("Error during password reset:", error)

      // Check if it's a Google OAuth user error
      if (
        error instanceof Error &&
        error.message.includes("auth/invalid-uid")
      ) {
        setNotificationState("google-oauth-password-reset-not-allowed")
        // Redirect to /auth after 2 seconds
        setTimeout(() => {
          router.push("/auth")
        }, 2000)
      } else {
        setNotificationState("forget-password-fail")
      }
    }
  }

  //            render: ForgetPasswordSection           //
  return (
    <div className="flex flex-col flex-1 justify-between">
      <AuthNotificationBox state={notificationState} />

      <div className="space-y-4">
        <AuthInputBox
          id="password"
          name="password"
          type="password"
          label="New Password"
          placeholder="Enter your new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <AuthInputBox
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>

      <div className="mt-auto space-y-6">
        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            type="button"
            label="Confirm"
            textSize="text-sm"
            className="justify-center w-full"
            onClick={handlePasswordReset}
          />
        </div>
      </div>
    </div>
  )
}
