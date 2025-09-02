import Link from "next/link"

const Sidebar = () => {
  const links = [
    { href: "/userprofile", label: "User Profile" },
    { href: "/marketplace", label: "Marketplace" },
  ]
  return (
    <div className="fixed w-48 h-[calc(100vh-3rem)] bg-gray-200 dark:bg-gray-800 p-4">
      {links.map((link) => (
        <div key={link.href} className="mb-2">
          <Link
            href={link.href}
            className="text-gray-800 dark:text-gray-200 hover:underline"
          >
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Sidebar
