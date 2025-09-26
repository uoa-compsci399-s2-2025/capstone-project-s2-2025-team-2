"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../config/firebase"
import client from "../services/fetch-client"

interface IuseAuthGuard {
  /**
   * If set to true, users aren't logged in should be redirected to the authentication page.
   * Set to false (default) if the page's content can be viewed by users who aren't logged in.
   */
  redirectToAuth: boolean
}

// the hook to be exported and consumed, contains functions for usage within components
const useAuthGuard = (options: IuseAuthGuard = { redirectToAuth: false }) => {
  const router = useRouter()
  const authPagePath = "/auth"

  // detect when user signs out and redirect if required
  useEffect(() => {
    if (!options.redirectToAuth) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push(authPagePath)
    })

    return () => unsubscribe()
  })

  const fetchWithAuth = async <T>(
    path: string,
    requestOptions: { protectedEndpoint: boolean } = {
      protectedEndpoint: true,
    },
  ): Promise<{ data: T; error: unknown; response: unknown } | null> => {
    // Get token directly from localStorage to avoid race conditions
    const authToken = localStorage.getItem("authToken")

    // if auth token doesnt exist on protected endpoint, redirect straight to auth, regardless of whether ``options.redirectToAuth`` is true or false
    if (requestOptions.protectedEndpoint && !authToken) {
      router.push(authPagePath)
      return null
    }

    const headersObj =
      requestOptions.protectedEndpoint && authToken
        ? {
            Authorization: `Bearer ${authToken}`,
          }
        : {}
    const { data, error, response } = await client.GET(path as any, {
      headers: headersObj,
    })

    // if we get 401 err (unauthorised) on a protected endpoint, redirect to auth if required
    if (
      requestOptions.protectedEndpoint &&
      (response.status === 401 || response.status === 403)
    ) {
      router.push(authPagePath)
      return null
    }

    return { data, error, response }
  }

  return {
    fetchWithAuth,
  }
}

export default useAuthGuard
