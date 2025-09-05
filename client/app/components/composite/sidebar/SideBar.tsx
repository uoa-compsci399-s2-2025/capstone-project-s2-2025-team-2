"use client"
import Link from "next/link"
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
} from "@heroicons/react/24/outline"
import Button from "../../generic/button/regular/Button"

const Sidebar = () => {
  const links = [
    {
      href: "/userprofile",
      label: "Profile",
      icon: UserCircleIcon,
      isButton: true,
    },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCartIcon },
  ]

  return (
    <div className="fixed pt-12 w-48 h-full bg-[var(--primary)]">
      {links.map(({ href, label, icon: Icon, isButton }, index) => (
        <div key={href} className="mb-2">
          {isButton ? (
            <Link href={href}>
              <div className="w-[8.5rem] mx-auto">
                <Button
                  className="py-1"
                  size="small"
                  icon={Icon}
                  label={label}
                  iconPosition="left"
                />
              </div>
            </Link>
          ) : (
            <Link
              href={href}
              className="flex items-center gap-2 text-[var(--white)] hover:underline"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )}
          {index === 0 && (
            <div className="my-2 h-[2px] w-full bg-gradient-to-r bg-gradient-to-r from-transparent from-15% via-blue-primary via-50% to-transparent to-85%" />
          )}
        </div>
      ))}

      <button
        onClick={() => alert("Signing out...")}
        className="fixed bottom-0 text-[var(--white)] hover:bg-red-600"
      >
        <div className="flex items-center gap-2 p-2">
          <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
          Sign Out
        </div>
      </button>
    </div>
  )
}

export default Sidebar
