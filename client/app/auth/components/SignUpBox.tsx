"use client"

import { useState } from "react"
import Button from "../../components/generic/button/regular/Button"
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"

//            function: SignUpBox           //
export default function SignUpBox() {
  //            state           //
  const [currentStep, setCurrentStep] = useState(1)
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false)

  //            function: handleEmailChange           //
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value
    setEmail(emailValue)
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsEmailValid(emailRegex.test(emailValue))
  }

  //            function: handleVerifyEmail           //
  const handleVerifyEmail = async () => {
    if (!isEmailValid) return
    
    try {
      // TODO: Implement email verification logic
      console.log("Sending verification code to:", email)
      alert("Verification code sent to your email!")
    } catch (error) {
      console.error("Error sending verification code:", error)
      alert("Failed to send verification code. Please try again.")
    }
  }

  //            function: handleNextStep           //
  const handleNextStep = () => {
    if (email && verificationCode) {
      setCurrentStep(2)
    } else {
    //   alert("Please fill in all required fields.")
    setCurrentStep(2)
    }
  }

  //            function: handleSignUp           //
  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!")
      return
    }

    try {
      // TODO: Implement sign up logic
      console.log("Signing up with:", { email, password })
      alert("Sign up successful!")
    } catch (error) {
      console.error("Error during sign up:", error)
      alert("Sign up failed. Please try again.")
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
      <div className="text-center mb-8">
        <h2>Sign Up</h2>
        <p className="mt-2 text-secondary">Create your account</p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-primary' : 'bg-muted'}`}></div>
        <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-primary' : 'bg-muted'}`}></div>
      </div>

      {currentStep === 1 ? (
        /* Step 1: Email and Verification */
        <div className="flex flex-col flex-1 justify-between">
          {/* Email Input and Verify Button */}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white">
                Email
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="flex-1 px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
                  placeholder="Enter your email"
                />
                <button
                  onClick={handleVerifyEmail}
                  disabled={!isEmailValid}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isEmailValid
                      ? 'bg-blue-primary text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-primary focus:ring-offset-2'
                      : 'bg-muted text-secondary cursor-not-allowed'
                  }`}
                >
                  Verify
                </button>
              </div>
            </div>

            <AuthInputBox
              id="verificationCode"
              name="verificationCode"
              type="text"
              label="Verification Code"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>

          <div className="mt-auto space-y-6">
          {/* Next Step Button */}
          <div className="flex justify-center w-full">
            <Button 
              type="button" 
              label="Next Page" 
              size="small"
              onClick={handleNextStep}
            />
          </div>

          {/* Sign In Link */}
          <AuthText className="text-center">
            Already have an account?{" "}
            <AuthLink href="/auth"> Sign in </AuthLink>
          </AuthText>
          </div>
        </div>
      ) : (
        /* Step 2: Password and Confirm Password */
        <div className="flex flex-col flex-1 justify-between">
          <div className="space-y-4">
            <AuthInputBox
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <AuthInputBox
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              placeholder="Confirm your password"
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
                label="Back" 
                size="small"
                onClick={handleBackToStep1}
              />
              <Button 
                type="button" 
                label="Confirm" 
                size="small"
                onClick={handleSignUp}
              />
            </div>

            {/* Sign In Link */}
            <AuthText className="text-center">
              Already have an account?{" "}
              <AuthLink href="/auth"> Sign in </AuthLink>
            </AuthText>
          </div>
        </div>
      )}
    </div>
  )
}
