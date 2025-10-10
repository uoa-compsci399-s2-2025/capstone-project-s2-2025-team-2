import { type AuthDomainAllowedRoles } from "business-layer/models/AuthDomain"

export interface AddSignupEmailDomainRequest {
  institutionName: string
  emailDomains: string[]
  allowedRoles: AuthDomainAllowedRoles
}
