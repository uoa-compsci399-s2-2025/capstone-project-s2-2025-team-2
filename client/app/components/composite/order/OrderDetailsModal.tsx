"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import { useState, useEffect } from "react"
import type { components } from "@/models/__generated__/schema"
import client from "@/app/services/fetch-client"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & { id: string; owner_id: string }
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  order: OrderWithId
  reagent: ReagentWithId
}

export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
  reagent,
}: OrderDetailsModalProps) {
  const [requesterName, setRequesterName] = useState<string>("Loading...")

  //requester name
  useEffect(() => {
    if (!isOpen || !order.requester_id) return

    const fetchRequesterName = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const { data } = await client.GET(`/users/${order.requester_id}` as any, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (data?.displayName) {
          setRequesterName(data.displayName.charAt(0).toUpperCase() + data.displayName.slice(1).toLowerCase())
        } else {
          setRequesterName("Unknown User")
        }
      } catch (error) {
        setRequesterName("Unknown User")
      }
    }

    fetchRequesterName()
  }, [isOpen, order.requester_id])


  if (!isOpen) return null

  const handleClose = () => {
    onClose()
  }

  //render modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/*bg blur + click handler for modal close*/}
      <div 
        className="absolute inset-0 backdrop-blur-sm bg-black/20"
        onClick={handleClose}
      />
      
      <div className="bg-primary/80 backdrop-blur-sm rounded-2xl p-6 border border-muted shadow-xl max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-xl font-medium">Order Details</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-300">Requester:</span>
            <span className="text-white">{requesterName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Status:</span>
            <span className="text-white font-medium capitalize">{order.status}</span>
          </div>
          {order.message && (
            <div className="flex flex-col">
              <span className="text-gray-300 mb-1">Message:</span>
              <span className="text-white text-sm">{order.message}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}