"use client"

import React, { useState, useEffect } from "react"
import { BeakerIcon } from "@heroicons/react/20/solid"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import { getCurrentUser } from "../../../services/firebase-auth"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface ReagentRequestProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  reagent: ReagentWithId
  requesterName: string
  ownerName: string
}

//reusable styling classes
const buttonStyles = "px-4 py-2 text-white rounded-lg"

const ChemIcon = () => (
  <div className="inline-flex items-center justify-center bg-blue-primary text-white rounded-full p-2">
    <BeakerIcon className="w-6 h-6" />
  </div>
)

//display user + reagent
const UserDisplay = ({
  name,
  reagentName,
  showIcon,
}: {
  name: string
  reagentName?: string
  showIcon?: boolean
}) => (
  <div className="flex flex-col items-center flex-1 min-w-0">
    <div className="flex items-center gap-3">
      <div
        className="text-white text-3xl font-semibold truncate max-w-[120px]"
        title={name}
      >
        {name}
      </div>
      {showIcon && <ChemIcon />}
    </div>
    {reagentName && (
      <div
        className="text-gray-400 text-base font-light mt-2 truncate max-w-[140px]"
        title={reagentName}
      >
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
  requesterName,
  ownerName,
}: ReagentRequestProps) => {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [ownerInfo, setOwnerInfo] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && reagent?.user_id) {
      const user = getCurrentUser()
      if (user && reagent.user_id === user.uid) {
        alert("You cannot request your own reagent!")
        onClose()
        return
      }
      fetchOwnerInfo(reagent.user_id)
    }
  }, [isOpen, reagent?.user_id, onClose])

  const fetchOwnerInfo = async (userId: string) => {
    try {
      const { data, error } = await client.GET(`/users/${userId}` as any, {})
      if (error) {
        console.error("Failed to fetch info:", error)
        return
      }
      setOwnerInfo(data)
    } catch (err) {
      console.error("Failed to fetch info:", err)
    }
  }

  if (!isOpen) return null

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token || !currentUser) {
        alert("Please sign in to make a request")
        return
      }

      const currentUserId = currentUser.uid

      const { error } = await client.POST("/orders" as any, {
        body: {
          req_id: currentUserId,
          reagent_id: reagent.id,
        },
        headers: { Authorization: `Bearer ${token}` },
      })

      if (error) {
        alert("Failed to create request")
        return
      }

      alert("Request sent successfully!")
      onSubmit()
      onClose()
    } catch {
      alert("Failed to create request")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-lg bg-primary rounded-2xl p-8 border border-muted">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
        >
          ×
        </button>

        <h2 className="text-white text-center text-2xl font-medium mb-8">
          Reagent Request
        </h2>

        <div className="flex items-center justify-center mb-8">
          {/*Reagent Requester*/}
          <UserDisplay
            name={
              currentUser?.displayName || currentUser?.email || requesterName
            }
            showIcon={false}
          />

          <span className="px-4 text-4xl text-gray-400">←</span>

          {/*Reagent Sender*/}
          <UserDisplay
            name={ownerInfo?.displayName || ownerInfo?.email || ownerName}
            reagentName={reagent.name}
            showIcon={true}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className={`${buttonStyles} bg-blue-primary hover:bg-blue-primary/80 min-w-[120px] text-base font-medium py-1 px-3`}
          >
            Request →
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReagentRequest
