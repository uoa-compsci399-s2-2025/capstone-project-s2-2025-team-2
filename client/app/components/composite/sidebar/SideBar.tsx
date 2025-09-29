"use client"
import Link from "next/link"
import { useState } from "react"
import {
  ShoppingCartIcon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  Bars3Icon,
  EnvelopeIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"
import Button from "../../generic/button/regular/Button"
import { firebaseSignOut } from "../../../services/firebase-auth"
import { toast } from "sonner"
import { auth } from "@/app/config/firebase"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  //sign out, clear token from localStorage, reload page
  const handleSignOut = async () => {
    try {
      await firebaseSignOut()
      localStorage.removeItem("authToken")
      window.location.reload()
    } catch {
      toast("Sign out failed!")
    }
  }

  const uid = auth?.currentUser?.uid
  const profileHref = uid ? `/profile/${uid}` : "/auth"

  const links = [
    {
      href: profileHref,
      label: "Profile",
      icon: UserCircleIcon,
      isButton: true,
    },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCartIcon },
    { href: "/inbox", label: "Inbox", icon: EnvelopeIcon },
    { href: "/requests", label: "Requests", icon: ClipboardDocumentListIcon },
  ]

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed z-50 shadow-lg lg:hidden top-0 w-full h-[4rem] bg-primary text-white flex items-center justify-between px-4 z-10">
        <Link href="/marketplace">
          <h3 className="m-0 lg:m-5 hover:text-light-gray duration-100 lg:hidden">
            Chemical.ly
          </h3>
        </Link>
        <h2 className="m-0 lg:m-5 hidden lg:block">Chemical.ly</h2>
        <button
          className="lg:hidden p-2 rounded-md text-white hover:text-light-gray duration-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </header>

      {/* Side bar */}
      <div
        className={`fixed pt-8 shadow-lg lg:pt-0 w-60 h-full bg-primary z-40 mt-14 lg:mt-0 transform transition-transform duration-300 
      ${isOpen ? "translate-x-0 right-0" : "translate-x-full right-0"}
       lg:left-0 lg:right-auto lg:translate-x-0 lg:block`}
      >
        <h2 className="hidden lg:block ml-7 mt-7 mb-4">Chemical.ly</h2>

        <div className="flex flex-col justify-between h-full">
          <div>
            {links.map(({ href, label, icon: Icon, isButton }, index) => (
              <div key={href}>
                {isButton ? (
                  <div className="flex justify-center px-4">
                    <Link href={href}>
                      <Button
                        className="gap-2 duration-300 flex justify-center"
                        icon={Icon}
                        iconPosition="left"
                        label={label}
                      />
                    </Link>
                  </div>
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
            <div
              className="flex items-center mb-30 p-2 text-red-70 cursor-pointer hover:text-red-70/80"
              onClick={handleSignOut}
            >
              <ArrowLeftStartOnRectangleIcon className="w-5 h-5" />
              Sign Out
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
