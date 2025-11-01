"use client"

//  type: AuthNotificationState
export type AuthNotificationState =
  | "not-displaying"
  | "sending"
  | "sending-fail"
  | "sent"
  | "validation-fail"
  | "validated"
  | "password-not-suitable"
  | "password-not-matching"
  | "signing-up"
  | "sign-up-success"
  | "sign-up-fail"
  | "signing-in"
  | "login-success"
  | "login-fail"
  | "forget-password-success"
  | "forget-password-fail"
  | "setting-forget-password"
  | "google-oauth-password-reset-not-allowed"
  | "email-already-exists"

// type: NotificationType
type NotificationType = "info" | "success" | "error"

//            interface: AuthNotificationBoxProps           //
interface AuthNotificationBoxProps {
  state: AuthNotificationState
}

//            interface: NotificationConfig           //
interface NotificationConfig {
  type: NotificationType
  message: string
}

//            function: getNotificationStyles           //
const getNotificationStyles = (type: NotificationType) => {
  switch (type) {
    case "info":
      return {
        bgColor: "bg-blue-500",
        borderColor: "border-blue-500",
        textColor: "text-blue-800",
      }
    case "success":
      return {
        bgColor: "bg-green-500",
        borderColor: "border-green-500",
        textColor: "text-green-800",
      }
    case "error":
      return {
        bgColor: "bg-red-500",
        borderColor: "border-red-500",
        textColor: "text-red-800",
      }
    default:
      return {
        bgColor: "bg-gray-500",
        borderColor: "border-gray-500",
        textColor: "text-gray-800",
      }
  }
}

//            function: getNotificationConfig           //
const getNotificationConfig = (
  state: AuthNotificationState,
): NotificationConfig => {
  switch (state) {
    case "sending":
      return {
        type: "info",
        message: "Sending verification code...",
      }
    case "sending-fail":
      return {
        type: "error",
        message: "Failed to send verification code. Please try again.",
      }
    case "sent":
      return {
        type: "success",
        message: "Verification code sent to your email!",
      }
    case "validation-fail":
      return {
        type: "error",
        message: "Verification code is incorrect. Please try again.",
      }
    case "validated":
      return {
        type: "success",
        message: "Verification code verified successfully!",
      }
    case "password-not-suitable":
      return {
        type: "error",
        message: "Password must be at least 6 characters long!",
      }
    case "password-not-matching":
      return {
        type: "error",
        message: "Passwords do not match!",
      }
    case "signing-up":
      return {
        type: "info",
        message: "Creating your account...",
      }
    case "sign-up-success":
      return {
        type: "success",
        message: "Account created successfully! You can now sign in.",
      }
    case "sign-up-fail":
      return {
        type: "error",
        message: "Sign up failed. Please try again.",
      }
    case "signing-in":
      return {
        type: "info",
        message: "Signing you in...",
      }
    case "login-success":
      return {
        type: "success",
        message: "Login successful! Welcome back.",
      }
    case "login-fail":
      return {
        type: "error",
        message: "Login failed. Please check your credentials and try again.",
      }
    case "forget-password-success":
      return {
        type: "success",
        message:
          "Password reset successfully! You can now sign in with your new password.",
      }
    case "forget-password-fail":
      return {
        type: "error",
        message: "Password reset failed. Please try again.",
      }
    case "setting-forget-password":
      return {
        type: "info",
        message: "Setting your new password...",
      }
    case "google-oauth-password-reset-not-allowed":
      return {
        type: "error",
        message:
          "Google sign-in users cannot change their password in CoLab. Please use Google to manage your account.",
      }
    case "email-already-exists":
      return {
        type: "error",
        message: "This email is already registered. Please sign in instead.",
      }
    default:
      return {
        type: "error",
        message: "Unknown state",
      }
  }
}

//            function: AuthNotificationBox           //
export default function AuthNotificationBox({
  state,
}: AuthNotificationBoxProps) {
  // Don't render anything if not displaying
  if (state === "not-displaying") {
    return null
  }

  const config = getNotificationConfig(state)
  const styles = getNotificationStyles(config.type)

  return (
    <div
      className={`mb-6 p-4 ${styles.bgColor} border ${styles.borderColor} ${styles.textColor} rounded`}
    >
      <p className="font-medium">{config.message}</p>
    </div>
  )
}
