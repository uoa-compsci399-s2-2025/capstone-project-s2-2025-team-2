import { useState, useEffect, useCallback } from "react"
import {
  EmailDomainValidationSchema,
  type EmailDomainValidationType,
} from "../../../shared/zod-schemas/signup-email-validation"
import useAuthGuard from "./useAuthGuard"
import { ZodError } from "zod"

interface EmailValidationState {
  isValid: boolean
  errorMessage: string | null
}

let allowedDomains: string[] = []
// hook to be consumed in manual email+pw signup component
export const useEmailValidation = () => {
  const { fetchWithAuth } = useAuthGuard({ redirectToAuth: false })
  const [validationState, setValidationState] = useState<EmailValidationState>({
    isValid: false,
    errorMessage: null,
  })

  // this useEffect only runs on component mount, not on rerenders
  useEffect(() => {
    const getValidDomains = async () => {
      try {
        const result = await fetchWithAuth<string[]>(
          `/auth/valid-email-domains`,
          { protectedEndpoint: false },
        )

        if (result) {
          const { data, error } = result
          if (data && !error) allowedDomains = result.data
          if (error) {
            console.error(
              `Failed to fetch valid signup email domains: ${error}`,
            )
          }
        }
      } catch (err) {
        console.error(`Failed to fetch valid signup email domains: ${err}`)
        setValidationState((prev) => ({
          ...prev,
          errorMessage: "Failed to load email validation",
        }))
      }
    }

    getValidDomains()
  }, [])

  // useCallback to memoize func
  const validateEmail = useCallback(
    (email: string) => {
      // if user has not inputted email or valid domains array is empty, return invalid state
      if (!email || allowedDomains.length === 0) {
        setValidationState((prev) => ({
          ...prev,
          isValid: false,
          errorMessage: null,
        }))
        return
      }

      try {
        EmailDomainValidationSchema(allowedDomains).parse({
          email,
        }) as EmailDomainValidationType

        // if zod schema successfully parses user inputted email, set validation state as successful
        setValidationState((prev) => ({
          ...prev,
          isValid: true,
          errorMessage: null,
        }))
      } catch (err) {
        // caught error comes from failed validation so cast as ZodError
        const typedErr = err as ZodError
        setValidationState((prev) => ({
          ...prev,
          isValid: false,
          errorMessage:
            typedErr.issues[0]?.message ||
            "Please use an accepted institutional email",
        }))
      }
    },
    [allowedDomains],
  )

  return {
    ...validationState,
    validateEmail,
  }
}
