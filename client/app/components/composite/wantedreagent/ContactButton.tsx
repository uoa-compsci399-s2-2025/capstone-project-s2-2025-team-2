"use client"
import client from "@/app/services/fetch-client"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { ReagentRequest } from "../reagent/ReagentRequest"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

type ReagentCategory = "chemical" | "hazardous" | "biological"
type ReagentTradingType = "trade" | "giveaway" | "sell"

interface WantedReagent {
  id: string
  name: string
  description: string
  createdAt: string
  createdAtReadable: string
  user_id: string
  userName?: string
  price?: number
  categories: ReagentCategory[]
  tradingType: ReagentTradingType
  location: string
  requesterOfferedReagentId?: string
}

interface ContactButtonProps {
  wanted: WantedReagent
  className?: string
}

const ContactButton = ({ wanted, className = "" }: ContactButtonProps) => {
  const [isCheckingInventory, setIsCheckingInventory] = useState(false)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [reagentOffered, setReagentOffered] = useState(false)

  //check if reagent has already been offered by the current user
    useEffect(() => {
    const checkOffered = async () => {
      if (!wanted) return
      try {
        const token = localStorage.getItem("authToken")
        const { data, error } = await client.GET(
          `/offers/${wanted.id}/offer` as any,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (error) {
          console.error("Failed to check request status:", error)
          return
        }

        if (data) {
          setReagentOffered(true)
        }
      } catch (error) {
        console.error("Failed to check request status:", error)
      }
    }
    checkOffered()
  }, [])

  // Fetch offered reagent name if requesterOfferedReagentId is present
  const [offeredReagentName, setOfferedReagentName] = useState<string>("")

  useEffect(() => {
    const fetchOfferedReagentName = async () => {
      if (!wanted?.requesterOfferedReagentId) {
        setOfferedReagentName("")
        return
      }
      try {
        const token = localStorage.getItem("authToken")
        const { data: reagent, error } = await client.GET(
          `/reagents/${wanted.requesterOfferedReagentId}` as any,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        if (error || !reagent) {
          setOfferedReagentName("")
        } else {
          setOfferedReagentName(reagent.name)
        }
      } catch {
        setOfferedReagentName("")
      }
    }
    fetchOfferedReagentName()
  }, [wanted?.requesterOfferedReagentId])

  const handleRequestClick = async () => {
    if (!wanted) return

    //check if user has reagents to offer for exchange

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
            "You need to have reagents in your inventory to offer. Please list some reagents first.",
          )
          return
        }
      } catch {
        toast.error("Failed to check your inventory. Please try again.")
        return
      } finally {
        setIsCheckingInventory(false)
      }
    

    setIsRequestOpen(true)
  }
  const handleRequestClose = () => {
    setIsRequestOpen(false)
  }

const handleRequestSubmit = (success: boolean) => {
  if (success) {
    console.log("Request submitted successfully")
    setReagentOffered(true)
  }
  setIsRequestOpen(false)
}

  // for the fields WantedReagent doesn't include from ReagentWithId.
  const reagentForRequest = {
    ...wanted,
    condition: (wanted as any).condition ?? "N/A",
    quantity: (wanted as any).quantity ?? 1,
    expiryDate: (wanted as any).expiryDate ?? new Date().toISOString(),
    unit: (wanted as any).unit ?? "unit",
  }

  return (
    <div className={className}>
      <button
        onClick={handleRequestClick}
        disabled={isCheckingInventory || reagentOffered}
        aria-busy={isCheckingInventory}

        className="flex items-center gap-0.5 px-2 py-1.5 text-sm font-medium text-white 
        bg-blue-primary hover:bg-blue-primary/70 rounded-lg transition-colors cursor-pointer
        disabled:bg-blue-primary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCheckingInventory ? "Checking..." : reagentOffered ? "Offered" : "Offer"}

        {!reagentOffered && <ArrowRightIcon className="w-5 h-5" />}
      </button>
      {wanted && (
        <ReagentRequest
          isOpen={isRequestOpen}
          onClose={handleRequestClose}
          onSubmit={handleRequestSubmit}
          reagent={reagentForRequest as any}
          title="Offer a Reagent"
          isBountyBoard={true}
          requesterOfferedReagentId={wanted.requesterOfferedReagentId}
          requesterOfferedReagentName={offeredReagentName}
        />
      )}
    </div>
  )
}

export default ContactButton
