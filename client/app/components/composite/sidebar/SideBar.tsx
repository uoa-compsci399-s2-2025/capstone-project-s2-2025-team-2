"use client"
import Link from "next/link"
import { ShoppingCartIcon, UserCircleIcon, ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/outline"
import BaseButton from "../../generic/button/regular/Button"

const Sidebar = () => {
  const links = [
    { href: "/userprofile", label: "User Profile", icon: UserCircleIcon },
    { href: "/marketplace", label: "Marketplace", icon: ShoppingCartIcon },
  ]

  return (
    <div className="fixed pt-12 w-48 h-full bg-[var(--primary)]">
     
      {links.map(({ href, label, icon: Icon }) => (
        <div key={href} className="mb-2">
          <Link
            href={href}
            className="flex items-center gap-2 text-[var(--white)] hover:underline"
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>


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
