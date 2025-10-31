import { LuHouse } from "react-icons/lu"
import Button from "../../generic/button/regular/Button"
import { useState, useEffect } from "react"
import ReagentRequest from "../reagent/ReagentRequest"
import client from "../../../services/fetch-client"
import type { components } from "@/models/__generated__/schema"
import { toast } from "sonner"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../config/firebase"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface SellerContactProps {
  reagent?: ReagentWithId
  sellerInfo?: any
}

const SellerContact = ({ sellerInfo, reagent }: SellerContactProps) => {
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isCheckingInventory, setIsCheckingInventory] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  //check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user)
    })
    return () => unsubscribe()
  }, [])

  const handleRequestClick = async () => {
    if (!reagent) return

    //check if user has reagents to offer for exchange
    if (reagent.tradingType === "trade") {
      setIsCheckingInventory(true)
      try {
        const token = localStorage.getItem("authToken")
        const { data: userReagents, error } = await client.GET(
          "/users/reagents" as any,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (error) {
          toast.error("Failed to check your inventory. Please try again.")
          return
        }

        if (!userReagents?.length) {
          toast.error(
            "You need to have reagents to offer before making a trade request. Please list some reagents first.",
          )
          return
        }
      } catch {
        toast.error("Failed to check your inventory. Please try again.")
        return
      } finally {
        setIsCheckingInventory(false)
      }
    }

    setIsRequestOpen(true)
  }

  const handleRequestClose = () => {
    setIsRequestOpen(false)
  }

  const handleRequestSubmit = () => {
    console.log("Request submitted successfully")
  }

  return (
    <div className="flex flex-row items-center md:mb-[2rem] gap-[4.5rem] md:gap-[8.5rem]">
      <div className="flex flex-row justify-center items-center">
        <div className="hidden md:block relative rounded-full h-[4rem] w-[4rem] overflow-hidden">
          {sellerInfo?.image && (
            <img
              src={sellerInfo.image}
              alt="User Profile Photo"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
              className="hidden"
            />
          )}

          <img
            src={
              imageLoaded && sellerInfo?.image
                ? sellerInfo.image
                : "/default_pfp.jpg"
            }
            alt="User Profile Photo"
            className="w-full h-full object-cover transition-opacity duration-300"
            style={{ imageRendering: "auto" }}
          />
        </div>

        <div className="hidden md:block mx-[1.5rem]">
          <h4 className="text-[1rem] text-white">
            {sellerInfo?.displayName || "Unknown Seller"}
          </h4>
          <span className="flex items-center text-[0.8rem] font-bold text-white">
            <LuHouse className="mr-[0.3rem]" />
            {reagent?.location || "Location not specified"}
          </span>
        </div>
      </div>

      {isSignedIn && (
        <Button
          label={isCheckingInventory ? "Checking..." : "Request Reagent"}
          onClick={handleRequestClick}
          disabled={isCheckingInventory}
          className="
            px-[1.5rem] py-[1.5rem] rounded-[18px] md:rounded-[8px] md:text-sm md:px-6 md:w-auto md:py-1.5 md:justify-center
            font-semibold hover:bg-blue-primary/70 transition-colors cursor-pointer
            "
        />
      )}

      {reagent && (
        <ReagentRequest
          isOpen={isRequestOpen}
          onClose={handleRequestClose}
          onSubmit={handleRequestSubmit}
          reagent={reagent}
        />
      )}
    </div>
  )
}

export default SellerContact
