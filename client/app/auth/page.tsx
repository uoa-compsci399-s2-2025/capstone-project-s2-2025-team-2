"use client"

import Button from "../components/generic/button/regular/Button"
import AuthInputBox from "../components/auth/AuthInputBox"
import AuthCheckbox from "../components/auth/AuthCheckbox"
import AuthLink from "../components/auth/AuthLink"
import AuthText from "../components/auth/AuthText"
import AuthDivider from "../components/auth/AuthDivider"
import AuthWelcomeBox from "../components/auth/AuthWelcomeBox"
import GoogleOAuthBtn from "../components/auth/GoogleOAuthBtn"
import { useState } from "react"

//            function: AuthPage           //
export default function AuthPage() {
  
  //            state           //
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //            function: handleSubmit           //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
    } catch (error) {
      console.error("Error:", error)
    }
  }

  //            render: AuthPage           //
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex gap-8 max-w-6xl w-full justify-center">
        {/* Left side - Sign In Box */}
        <div className="max-w-md w-full space-y-8 p-8 bg-primary rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="text-center">
          <h2>Sign In</h2>
          <p className="mt-2 text-secondary">Sign in to your account</p>
        </div>
        
        {/* Google OAuth Button */}
        <div className="w-full flex justify-center items-center">
          <GoogleOAuthBtn onClick={() => console.log("Google OAuth clicked")} />
        </div>

        {/* Divider */}
        <AuthDivider text="or use your account" />

        {/* Form Section */}
        <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
          
          {/* 1. Input Fields */}
          <div className="space-y-4">
            <AuthInputBox id="email" name="email" type="email" label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <AuthInputBox id="password" name="password" type="password" label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {/* 2. Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <AuthCheckbox id="remember-me" name="remember-me" label="Remember me" />
            <AuthLink href="#" className="text-sm">Forgot your password?</AuthLink>
          </div>

          {/* 3. Submit Button */}
          <div className="flex justify-center w-full">
            <Button type="submit" label="Sign In" size="small" />
          </div>

          {/* 4. Sign Up Link */}
          <AuthText className="text-center"> Don't have an account? <AuthLink href="/auth/signup"> Sign up </AuthLink></AuthText>
        </form>
        </div>
        
        {/* Right side - Welcome Box */}
        <AuthWelcomeBox />
      </div>
    </div>
  )
}
