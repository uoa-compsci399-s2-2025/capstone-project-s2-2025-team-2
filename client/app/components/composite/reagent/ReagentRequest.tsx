"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  BeakerIcon,
  XMarkIcon,
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/20/solid"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import { toast } from "sonner"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../config/firebase"
import LoadingState from "../loadingstate/LoadingState"
import Link from "next/link"
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

const TRADING_CONFIG = {
  giveaway: { icon: GiftIcon, color: "text-blue-100" },
  sell: { icon: CurrencyDollarIcon, color: "text-green-100" },
  trade: { icon: ArrowsRightLeftIcon, color: "text-purple-100" },
} as const

interface ReagentRequestProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  reagent: ReagentWithId
  title?: string
  isBountyBoard?: boolean
  requesterOfferedReagentId?: string
  requesterOfferedReagentName?: string
}

interface UserDisplayProps {
  name: string
  reagentName?: string
  showIcon?: boolean
  showDropdown?: boolean
  showPriceInput?: boolean
  price?: string
  onPriceChange?: (price: string) => void
  userReagents?: ReagentWithId[]
  selectedReagentId?: string
  onReagentChange?: (reagentId: string) => void
  isSubmitting?: boolean
  reagentLink?: string
}

const UserDisplay = ({
  name,
  reagentName,
  showIcon,
  showDropdown,
  showPriceInput,
  price = "",
  onPriceChange,
  userReagents = [],
  selectedReagentId = "",
  onReagentChange,
  isSubmitting = false,
  reagentLink,
}: UserDisplayProps) => (
  <div className="flex flex-col items-center flex-1 min-w-0">
    <div className="flex items-center gap-3">
      <div className="text-white text-3xl font-semibold truncate md:truncate-none max-w-[80px] md:max-w-none">
        {name}
      </div>
      {showIcon && !showPriceInput && (
        <div className="inline-flex items-center justify-center bg-blue-primary text-white rounded-full p-2 shadow-lg">
          <BeakerIcon className="w-6 h-6" />
        </div>
      )}
      {showPriceInput && (
        <div
          className="inline-flex items-center rounded-full px-1.5 py-1 shadow-lg"
          style={{ backgroundColor: "var(--succ-green-light)" }}
        >
          <div className="w-6 h-6 flex items-center justify-center text-white font-black text-lg leading-none">
            $
          </div>
          <input
            type="number"
            value={price}
            onChange={(e) => onPriceChange?.(e.target.value)}
            className="bg-transparent text-white w-16 text-center focus:outline-none text-base font-medium leading-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0.00"
            min="0"
            disabled={isSubmitting}
          />
        </div>
      )}
    </div>
    {showDropdown ? (
      <div className="mt-2 w-full max-w-[145px] relative">
        <select
          value={selectedReagentId}
          onChange={(e) => onReagentChange?.(e.target.value)}
          className="w-full text-base font-light text-gray-400 focus:outline-none truncate"
          disabled={isSubmitting}
        >
          {userReagents.map((reagent) => (
            <option key={reagent.id} value={reagent.id}>
              {reagent.name}
            </option>
          ))}
        </select>
      </div>
    ) : (
      reagentName &&
      (reagentLink ? (
        <Link
          href={reagentLink}
          className="text-gray-400 text-base font-light mt-2 truncate max-w-[140px] hover:text-blue-primary hover:underline transition-colors block"
          title={reagentName}
        >
          {reagentName}
        </Link>
      ) : (
        <div
          className="text-gray-400 text-base font-light mt-2 truncate max-w-[140px]"
          title={reagentName}
        >
          {reagentName}
        </div>
      ))
    )}
  </div>
)

export const ReagentRequest = ({
  isOpen,
  onClose,
  onSubmit,
  reagent,
  isBountyBoard = false,
  requesterOfferedReagentId,
  requesterOfferedReagentName,
}: ReagentRequestProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [ownerInfo, setOwnerInfo] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [isInitialising, setIsInitialising] = useState(true)
  const [message, setMessage] = useState<string>("")
  const [price, setPrice] = useState(
    reagent.price ? Number(reagent.price).toFixed(2) : "",
  )
  const [offeredReagentId, setOfferedReagentId] = useState("")
  const [userReagents, setUserReagents] = useState<ReagentWithId[]>([])
  //prevent state updates if window isclosed
  const guardUpdate = (isClosed: boolean, updateState: () => void) => {
    if (!isClosed) updateState()
  }

  //changes user based on auth state
  useEffect(() => {
    if (!isOpen) return

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })

    return () => {
      unsubscribe()
    }
  }, [isOpen])

  //owner info and validation effect
  useEffect(() => {
    if (!isOpen) {
      setError("")
      setIsInitialising(true)
      setOwnerInfo(null)
      setMessage("")
      setOfferedReagentId("")
      setUserReagents([])
      return
    }

    let isClosed = false

    //validate user
    const validateUser = () => {
      if (!currentUser) return false
      if (currentUser.uid === reagent.user_id) {
        guardUpdate(isClosed, () => {
          setError("You cannot request your own reagent")
          setIsInitialising(false)
        })
        return false
      }
      return true
    }

    //fetch owner info for display
    const fetchOwner = async () => {
      try {
        const owner = await client.GET(`/users/${reagent.user_id}` as any, {})
        if (owner.error) {
          guardUpdate(isClosed, () =>
            setError("Failed to fetch owner information."),
          )
        } else {
          guardUpdate(isClosed, () => {
            setOwnerInfo(owner.data)
            setError("")
          })
        }
      } catch {
        guardUpdate(isClosed, () =>
          setError("Failed to fetch owner information."),
        )
      }
    }

    //exchange: fetch user's reagents to offer
    const fetchUserReagents = async () => {
      if (!isBountyBoard && reagent.tradingType !== "trade") return
      if (!currentUser) return
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        const { data: reagents, error } = await client.GET(
          "/users/reagents" as any,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )

        if (error) {
          console.error("API error:", error)
          return
        }

        guardUpdate(isClosed, () => {
          setUserReagents(reagents || [])
          //offers first reagent in array by default
          if (reagents && reagents.length > 0) {
            setOfferedReagentId(reagents[0].id)
          }
        })
      } catch (error) {
        console.error("Failed to fetch user reagents:", error)
      }
    }

    //initialise data and set loading to false
    const initialise = async () => {
      // Wait for auth state to be determined
      if (currentUser === null) {
        // Still waiting for Firebase auth check
        return
      }

      if (validateUser()) {
        const promises = [fetchOwner()]
        if (isBountyBoard || reagent.tradingType === "trade") {
          promises.push(fetchUserReagents())
        }
        await Promise.all(promises)
        guardUpdate(isClosed, () => setIsInitialising(false))
      } else {
        // currentUser exists but validation failed (trying to request own reagent)
        guardUpdate(isClosed, () => setIsInitialising(false))
      }
    }

    initialise()

    return () => {
      isClosed = true
    }
  }, [isOpen, currentUser, reagent.user_id])

  //auth token fetch + check
  const handleSubmit = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return

    //submit order request
    //no need to pass req id, backend will use auth user id
    setIsSubmitting(true)
    try {
      const requestBody = isBountyBoard
        ? {
            // Bounty board: creating an offer for a wanted reagent
            reagent_id: reagent.id,
            ...(message.trim() && { message: message.trim() }),
            offeredReagentId,
            ...(reagent.tradingType === "sell" && {
              type: "trade",
              price: Number(price),
            }),
            ...(reagent.tradingType === "trade" && {
              type: "order",
            }),
            ...(reagent.tradingType === "giveaway" && { type: "order" }),
          }
        : {
            // marketplace: creating an order for a reagent
            reagent_id: reagent.id,
            ...(message.trim() && { message: message.trim() }),
            ...(reagent.tradingType === "sell" && {
              type: "trade",
              price: Number(price),
            }),
            ...(reagent.tradingType === "trade" && {
              type: "exchange",
              offeredReagentId,
            }),
            ...(reagent.tradingType === "giveaway" && { type: "order" }),
          }

      //call endpoint based on trading type and context
      const baseEndpoint = isBountyBoard ? "/offers" : "/orders"
      const endpoint =
        reagent.tradingType === "giveaway" ||
        (isBountyBoard && reagent.tradingType === "trade")
          ? baseEndpoint
          : reagent.tradingType === "sell"
            ? `${baseEndpoint}/trades`
            : `${baseEndpoint}/exchanges`

      console.log(
        `Making ${reagent.tradingType} ${isBountyBoard ? "offer" : "request"}!`,
      )

      const { error } = await client.POST(endpoint as any, {
        body: requestBody,
        headers: { Authorization: `Bearer ${token}` },
      })

      if (error) throw new Error("Failed to create request. Please try again.")

      const actionWord = isBountyBoard ? "offer" : "request"
      toast(
        reagent.tradingType.charAt(0).toUpperCase() +
          reagent.tradingType.slice(1) +
          ` ${actionWord} sent successfully!`,
      )
      onSubmit()
      onClose()
    } catch {
      setError("Failed to create request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [
    reagent.id,
    message,
    reagent.tradingType,
    price,
    offeredReagentId,
    onSubmit,
    onClose,
    isBountyBoard,
  ])

  const handleClose = useCallback(() => {
    if (!isSubmitting) {
      setError("")
      setMessage("")
      onClose()
    }
  }, [isSubmitting, onClose])

  if (!isOpen) return null

  const requesterName = currentUser?.displayName || "You"
  const ownerName = ownerInfo?.displayName || "User"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
    >
      <div className="relative w-full max-w-xl bg-primary/80 backdrop-blur-sm rounded-2xl p-6 border border-muted shadow-2xl">
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {isInitialising ? (
          //loading state while validating/initialising
          <div className="text-center">
            <LoadingState pageName="Message" />
          </div>
        ) : error ? (
          //error window
          <div className="text-center">
            <h2 className="text-red-400 text-2xl font-medium mb-4">Error</h2>
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : (
          //request window
          <div>
            <h2 className="text-white text-center text-2xl font-medium mb-8 flex items-center justify-center gap-2">
              <span
                className={`flex items-center gap-1 text-2xl font-medium ${TRADING_CONFIG[reagent.tradingType as keyof typeof TRADING_CONFIG].color}`}
              >
                {React.createElement(
                  TRADING_CONFIG[
                    reagent.tradingType as keyof typeof TRADING_CONFIG
                  ].icon,
                  { className: "w-6 h-6" },
                )}
                {reagent.tradingType.charAt(0).toUpperCase() +
                  reagent.tradingType.slice(1)}
              </span>
              <span className="text-2xl font-medium">
                {isBountyBoard ? "Offer" : "Request"}
              </span>
            </h2>

            <div className="flex items-center justify-center mb-8">
              <UserDisplay
                name={requesterName}
                showDropdown={isBountyBoard || reagent.tradingType === "trade"}
                showIcon={reagent.tradingType === "trade"}
                showPriceInput={reagent.tradingType === "sell"}
                price={price}
                onPriceChange={setPrice}
                userReagents={userReagents}
                selectedReagentId={offeredReagentId}
                onReagentChange={setOfferedReagentId}
                isSubmitting={isSubmitting}
              />
              <span className="px-4 text-4xl text-gray-400">
                {isBountyBoard ? "→" : "←"}
              </span>
              <UserDisplay
                name={ownerName}
                reagentName={
                  isBountyBoard
                    ? requesterOfferedReagentName || undefined
                    : reagent.name
                }
                reagentLink={
                  isBountyBoard && requesterOfferedReagentId
                    ? `/marketplace/${requesterOfferedReagentId}`
                    : `/marketplace/${reagent.id}`
                }
                showIcon
              />
            </div>

            <div className="mb-6">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Attach a message (optional)..."
                className="w-full px-4 py-3 rounded-xl bg-gray-100/20 text-gray-100 placeholder-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-primary resize-none"
                rows={4}
                maxLength={500}
                disabled={isSubmitting}
              />
              <div className="text-right text-xs text-gray-300 mt-1">
                {message.length}/500
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-primary hover:bg-blue-primary/80 min-w-[120px] text-base font-medium flex items-center justify-center gap-2"
              >
                {isBountyBoard ? "Offer →" : "Request →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReagentRequest
