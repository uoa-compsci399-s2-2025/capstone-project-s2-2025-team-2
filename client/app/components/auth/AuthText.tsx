interface AuthTextProps {
  children: React.ReactNode
  className?: string
}

export default function AuthText({ children, className = "" }: AuthTextProps) {
  return (
    <p className={`text-sm text-secondary ${className}`}>
      {children}
    </p>
  )
}
