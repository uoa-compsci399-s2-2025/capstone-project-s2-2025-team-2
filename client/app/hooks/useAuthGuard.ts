"use client"
import { useEffect, useMemo, useState } from "react"
import { onIdTokenChanged } from "firebase/auth"
import { useRouter } from "next/navigation"
import { auth } from "@/app/config/firebase"
import client from "../services/fetch-client"

interface IuseAuthGuard {
  /**
   * When true, redirects users who aren't logged in to the auth page.
   * Set to false (default) if the page's content can be viewed by users who aren't logged in.
   */
  redirectToAuth: boolean
}

// the hook to be exported and consumed, contains functions for usage within components
const useAuthGuard = (options: IuseAuthGuard = { redirectToAuth: false }) => {
  const router = useRouter()
  const authPagePath = "/auth"

  const [authToken, setAuthToken] = useState<string | null>(null)
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null)

  // onIdTokenChanged functionality
  useEffect(() => {
    if (!auth) return
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      // if user exists, refresh token
      if (user) {
        const token = await user.getIdToken()
        localStorage.setItem("authToken", token)
        setAuthToken(token)
        setCurrentUserUid(user.uid)
      } else {
        localStorage.removeItem("authToken")
        setAuthToken(null)
        setCurrentUserUid(null)
        if (options.redirectToAuth) {
          router.push(authPagePath)
        }
      }
    })
    return () => unsubscribe()
  }, [router])

  // initialise auth token from localstorage if it exists
  useEffect(() => {
    const existingAuthToken = localStorage.getItem("authToken")
    if (existingAuthToken) setAuthToken(existingAuthToken)
  }, [])

  const fetchWithAuth = async <T>(paths: string): Promise<T | null> => {
    let res = await client.GET(paths as any, {
      Authorization: `Bearer ${authToken}`,
    })

    // if we get 401 error, refresh user auth token and try fetch again
    if (res?.error?.status === 401) {
      const user = auth.currentUser
      if (!user) {
        if (options.redirectToAuth) {
          router.push(authPagePath)
        }
        return null
      }
      const refreshedToken = await user.getIdToken(true)
      localStorage.setItem("authToken", refreshedToken)
      setAuthToken(refreshedToken)
      res = await client.GET(paths as any, {
        Authorization: `Bearer ${authToken}`,
      })

      // if we get 401 error again, high chance user isn't logged in -- redirect to auth
      if (res?.error?.status === 401) {
        if (options.redirectToAuth) {
          router.push(authPagePath)
        }
        return null
      }
    }

    return res as T
  }

  return {
    authToken,
    currentUserUid,
    fetchWithAuth,
  }
}

export default useAuthGuard
