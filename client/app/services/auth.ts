import client from "./fetch-client"

const VERIFY_GOOGLE_OAUTH_URL = "/auth/google/verify"

export const oauthVerify = async (idToken: string) => {
  const response = await client.POST(VERIFY_GOOGLE_OAUTH_URL, {
    body: { idToken },
  })
  return response
}