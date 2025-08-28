interface AuthLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function AuthLink({
  href,
  children,
  className = "",
}: AuthLinkProps) {
  return (
    <a
      href={href}
      className={`font-medium text-blue-primary hover:text-blue-secondary ${className}`}
    >
      {children}
    </a>
  )
}
