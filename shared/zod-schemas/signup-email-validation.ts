import { z } from "zod"

// schema that validates user inputted email against valid email domains
export const EmailDomainValidationSchema = (acceptedDomains: string[]) => {
  return z.object({
    email: z
      .string()
      .min(1, "Email is required")
      .refine(
        (email) => {
          const userEmailDomain = email.slice(email.indexOf("@"))
          return acceptedDomains.includes(userEmailDomain)
        },
        {
          message: `Please enter an accepted institutional email`,
        },
      ),
  })
}

export type EmailDomainValidationType = z.infer<
  typeof EmailDomainValidationSchema
>
