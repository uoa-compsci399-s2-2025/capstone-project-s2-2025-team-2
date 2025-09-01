import { useEffect, useRef } from "react"
import GoogleOAuthRequestDto from "../models/request-models/GoogleOAuthRequestDto"
import GoogleOAuthResponseDto from "../models/response-models/GoogleOAuthResponseDto"
import { oauthVerify } from "../services/auth"

declare global {
  interface Window {
    google: any
  }
}

interface GoogleOAuthBtnProps {
  onSuccess?: (user: any) => void
  onError?: (error: any) => void
}

export const useGoogleOAuth = ({ onSuccess, onError }: GoogleOAuthBtnProps) => {
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Google Identity Services script
    const loadGoogleScript = () => {
      if (typeof window !== "undefined" && !window.google) {
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = initializeGoogleAuth
        document.head.appendChild(script)
      } else if (window.google) {
        initializeGoogleAuth()
      }
    }

    // Initialize Google OAuth
    const initializeGoogleAuth = () => {
      if (typeof window !== "undefined" && window.google && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
        })
      }
    }

    // Handle Google authentication response
    const handleCredentialResponse = async (response: any) => {
      try {
        // Send ID token to server for verification
        const requestData: GoogleOAuthRequestDto = {
          idToken: response.credential,
        }

        const result = await oauthVerify(requestData.idToken)

        if (result.error) {
          throw new Error("Authentication failed")
        }

        const responseData: GoogleOAuthResponseDto = result.data

        if (responseData.success && onSuccess) {
          onSuccess(responseData.user)
        }
      } catch (error) {
        console.error("Google authentication error:", error)
        if (onError) {
          onError(error)
        }
      }
    }

    loadGoogleScript()

    return () => {
      // Cleanup
      if (typeof window !== "undefined" && window.google) {
        window.google.accounts.id.disableAutoSelect()
      }
    }
  }, [onSuccess, onError])

  return {
    buttonRef,
  }
}
