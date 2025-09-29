interface AuthLinkProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export default function AuthLink({
  children,
  className = "",
  onClick,
}: AuthLinkProps) {
  return (
    <button
      className={`font-normal text-sm text-blue-primary hover:text-blue-secondary ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
