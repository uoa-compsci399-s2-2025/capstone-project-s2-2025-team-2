import OutlinedButton from "../generic/button/outlined/OutlinedButton"
import Link from "next/link"

interface AuthWelcomeBoxProps {
  setAuthType: (authType: "signin" | "signup" | "forgotpassword") => void
}
export default function AuthWelcomeBox({ setAuthType }: AuthWelcomeBoxProps) {
  return (
    <div className="max-w-md w-full space-y-8 p-8 bg-gradient-to-b from-blue-400/90 to-purple-600/90 rounded-lg shadow-lg flex flex-col justify-center hidden lg:flex">
      {/* Welcome Content */}
      <div className="text-center">
        <h2 className="mb-2">Welcome to</h2>
        <Link href="/">
          <h1 className="text-orange-400 mb-6 cursor-pointer">CoLab</h1>
        </Link>
        <p className="mb-8">
          Join CoLab today and be part of a growing community that shares,
          reuses, and collaborates on research reagents.
        </p>
        {/* Call to Action Button */}
        <OutlinedButton
          label="Sign Up"
          textSize="text-sm"
          backgroundColor="white"
          className="border-white"
          onClick={() => setAuthType("signup")}
        />
      </div>
    </div>
  )
}
