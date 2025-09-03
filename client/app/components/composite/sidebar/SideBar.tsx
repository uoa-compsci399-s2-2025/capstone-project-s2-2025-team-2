import Link from "next/link"

const Sidebar = () => {
  const links = [
    { href: "/userprofile", label: "User Profile" },
    { href: "/marketplace", label: "Marketplace" },
  ]
  return (
    <div className="fixed w-48 h-[calc(100vh-3rem)] bg-[var(--primary)]  p-4">
      {links.map((link) => (
        <div key={link.href} className="mb-2">
          <Link
            href={link.href}
            className="text-[var(--white)] hover:underline"
          >
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Sidebar
