"use client"
import Link from "next/link"
import { useState } from "react"
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import Button from "../../generic/button/regular/Button"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
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
    <>
    <header className="md:hidden fixed top-0 w-full h-14 bg-primary text-white flex items-center px-4 z-10">
      <h2 className="m-5">Chemical.ly</h2>
            <button
        className="md:hidden absolute top-4 left-4 p-2 rounded-md text-secondary hover:bg-secondary/20 duration-300"
        onClick={() => setIsOpen(true)}
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
    </header>



    <div className={`fixed pt-12 md:pt-0 w-60 h-full bg-primary z-40 mt-4 md:mt-0 transform transition-transform duration-300 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 md:block`}
      >
      <h2 className="hidden md:block m-5 mt-7">Chemical.ly</h2>


      <div className="absolute top-4 right-4 md:hidden">
        <button onClick={() => setIsOpen(false)} >
        <XMarkIcon className="h-6 w-6" />
        </button>
      </div>  

      <div className="flex flex-col justify-between h-full">
        <div>

          {links.map(({ href, label, icon: Icon, isButton }, index) => (
            <div className="mb-2" key={href}>
              {isButton ? (
                <Link href={href}>
                  <div className="mt-1 w-[8.5rem] mx-auto">
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
        {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      </>
  )
}

export default Sidebar
