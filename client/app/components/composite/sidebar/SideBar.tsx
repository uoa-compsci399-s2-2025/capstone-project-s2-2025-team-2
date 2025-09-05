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
    <div className="pt-12 w-48 h-full bg-primary">
      {links.map(({ href, label, icon: Icon, isButton }, index) => (
        <div key={href} className="mb-2">
          {isButton ? (
            <Link href={href}>
              <div className="w-[8.5rem] mx-auto">
                <Button
                  className="py-1 gap-2 duration-300"
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
              className="flex items-center gap-2 text-[var(--white)] hover:bg-secondary/30 duration-300 p-2 rounded-md m-4 "
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          )}
          {index === 0 && (
            <div className="my-2 h-[2px] w-full bg-gradient-to-r from-transparent from-15% via-blue-primary via-50% to-transparent to-85%" />
          )}
        </div>
      ))}

      <div className=" bottom-0 w-full flex justify-center">
        <div className="flex items-center mt-20 p-2 text-red-70 cursor-pointer hover:text-red-70/80">
          <ArrowLeftStartOnRectangleIcon
            className="w-5 h-5"
            onClick={() => alert("Signing out...")}
          />
          Sign Out
        </div>
      </div>
    </div>
  )
}

export default Sidebar
