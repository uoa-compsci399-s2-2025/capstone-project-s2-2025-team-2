"use client"

import { useGoogleOAuth } from "../../hooks/useGoogleOAuth"

interface GoogleOAuthBtnProps {
  onSuccess?: (user: any) => void
  onError?: (error: any) => void
}

export default function GoogleOAuthBtn({
  onSuccess,
  onError,
}: GoogleOAuthBtnProps) {
  {
    /* 3. Use the useGoogleOAuth hook to render the Google OAuth button */
  }
  {
    /* 6. useGoogleOAuth returns buttonRef */
  }
  const { buttonRef } = useGoogleOAuth({ onSuccess, onError })

  {
    /* 7. buttonRef is rendered on virtual DOM */
  }
  {
    /* 8. buttonRef rendered on DOM */
  }
  {
    /* 9. ref.current is assigned to the buttonRef */
  }
  return (
    <div className="w-full max-w-[400px] mx-auto">
      <div
        ref={buttonRef}
        id="google-signin-button"
        className="w-full [&_div]:w-full"
      />
    </div>
  )
}
