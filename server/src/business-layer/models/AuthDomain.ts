export type AuthDomainAllowedRoles = Array<"staff" | "student">

export interface AuthDomain {
  emailDomains: string[]
  institutionName: string
  allowedRoles: AuthDomainAllowedRoles
}
