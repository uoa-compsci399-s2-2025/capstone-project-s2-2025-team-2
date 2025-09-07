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
    { href: "/inbox", label: "Inbox", icon: ShoppingCartIcon },
    { href: "/orders", label: "Orders", icon: ShoppingCartIcon },
  ]

  return (
    <div className="fixed pt-12 w-60 h-full bg-primary mt-4">
      <div className="flex flex-col justify-between h-full">
        <div>
          {links.map(({ href, label, icon: Icon, isButton }, index) => (
            <div className="mb-2" key={href}>
              {isButton ? (
                <Link href={href}>
                  <div className="mt-5 w-[8.5rem] mx-auto">
                    <Button
                      className="py-1 gap-2 duration-300"
                      icon={Icon}
                      iconPosition="left"
                      label={label}
                      size="small"
                    />
                  </div>
                </Link>
              ) : (
                <Link
                  className="flex items-center gap-2 text-[var(--white)] hover:bg-secondary/30 duration-300 p-2 rounded-md m-4 "
                  href={href}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              )}
              {index === 0 && (
                <div className="mt-5 h-[2px] w-full bg-gradient-to-r from-transparent from-15% via-blue-primary via-50% to-transparent to-85%" />
              )}
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center">
          <div className="flex items-center mb-20 p-2 text-red-70 cursor-pointer hover:text-red-70/80">
            <ArrowLeftStartOnRectangleIcon
              className="w-5 h-5"
              onClick={() => alert("Signing out...")}
            />
            Sign Out
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
