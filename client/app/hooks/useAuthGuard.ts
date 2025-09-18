"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import client from "../services/fetch-client"

interface IuseAuthGuard {
  /**
   * If set to true, users aren't logged in should be redirected to the authentication page.
   * Set to false (default) if the page's content can be viewed by users who aren't logged in.
   */
  redirectToAuth: boolean
}

// the hook to be exported and consumed, contains functions for usage within components
const useAuthGuard = (options: IuseAuthGuard = { redirectToAuth: true }) => {
  const router = useRouter()
  const authPagePath = "/auth"

  const fetchWithAuth = async <T>(
    path: string,
    requestOptions: { protectedEndpoint: boolean } = {
      protectedEndpoint: true,
    },
  ): Promise<{ data: T; error: unknown; response: unknown } | null> => {
    // Get token directly from localStorage to avoid race conditions
    const authToken = localStorage.getItem("authToken")
    const headersObj = requestOptions.protectedEndpoint
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
      response.status === 401 &&
      options.redirectToAuth
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
