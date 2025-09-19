"use client"

import React, { useState, useEffect, useCallback } from "react"
import { BeakerIcon, XMarkIcon } from "@heroicons/react/20/solid"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../config/firebase"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface ReagentRequestProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  reagent: ReagentWithId
}

interface UserDisplayProps {
  name: string
  reagentName?: string
  showIcon?: boolean
}

const UserDisplay = ({ name, reagentName, showIcon }: UserDisplayProps) => (
  <div className="flex flex-col items-center flex-1 min-w-0">
    <div className="flex items-center gap-3">
      <div className="text-white text-3xl font-semibold truncate max-w-[120px]" title={name}>
        {name}
      </div>
      {showIcon && (
        <div className="inline-flex items-center justify-center bg-blue-primary text-white rounded-full p-2 shadow-lg">
          <BeakerIcon className="w-6 h-6" />
        </div>
      )}
    </div>
    {reagentName && (
      <div className="text-gray-400 text-base font-light mt-2 truncate max-w-[140px]" title={reagentName}>
        {reagentName}
      </div>
    )}
  </div>
)

export const ReagentRequest = ({
  isOpen,
  onClose,
  onSubmit,
  reagent,
}: ReagentRequestProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [ownerInfo, setOwnerInfo] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>("")
  const [isInitializing, setIsInitializing] = useState(true)
  const [message, setMessage] = useState<string>("")

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
      setIsInitializing(true)
      setOwnerInfo(null)
      setMessage("")
      return
    }

    let isClosed = false

    //signed in, no self-request
    const validateUser = () => {
      if (!currentUser) {
        guardUpdate(isClosed, () => {
          setError("Please sign in to make a request")
          setIsInitializing(false)
        })
        return false
      }

      if (currentUser.uid === reagent.user_id) {
        guardUpdate(isClosed, () => {
          setError("You cannot request your own reagent")
          setIsInitializing(false)
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
          guardUpdate(isClosed, () => setError("Failed to fetch owner information."))
        } else {
          guardUpdate(isClosed, () => {
            setOwnerInfo(owner.data)
            setError("")
          })
        }
      } catch {
        guardUpdate(isClosed, () => setError("Failed to fetch owner information."))
      } finally {
        guardUpdate(isClosed, () => setIsInitializing(false))
      }
    }

    if (validateUser()) {
      fetchOwner()
    }

    return () => {
      isClosed = true
    }
  }, [isOpen, currentUser, reagent.user_id])

  //auth token fetch + check
  const handleSubmit = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      return
    }

    //submit order request
    //no need to pass req id, backend will us auth user id
    setIsSubmitting(true)
    try {
      const { error } = await client.POST("/orders" as any, {
        body: { 
          reagent_id: reagent.id, 
          req_id: "",
          ...(message.trim() && { message: message.trim() })
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (error) throw new Error("Failed to create request. Please try again.")

      alert("Request sent successfully!")
      onSubmit()
      onClose()
    } catch {
      setError("Failed to create request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }, [reagent.id, message, onSubmit, onClose])


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
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div 
        className="relative w-full max-w-lg bg-primary rounded-2xl p-8 border border-muted shadow-2xl"
      >
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {isInitializing ? (
          //loading state while validating/init
          <div className="text-center">
            <h2 className="text-white text-2xl font-medium mb-4">Loading...</h2>
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
            <h2 className="text-white text-center text-2xl font-medium mb-8">
              Reagent Request
            </h2>
            
            <div className="flex items-center justify-center mb-8">
              <UserDisplay name={requesterName} />
              <span className="px-4 text-4xl text-gray-400">←</span>
              <UserDisplay 
                name={ownerName} 
                reagentName={reagent.name} 
                showIcon 
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-300 mb-2">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Attach a message..."
                className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent resize-none"
                rows={3}
                maxLength={500}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-blue-primary hover:bg-blue-primary/80 min-w-[120px] text-base font-medium flex items-center justify-center gap-2"
              >
                Request →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReagentRequest