"use client"

import React, { useState, useEffect } from "react"
import { getCurrentUser } from "../services/firebase-auth"
import client from "../services/fetch-client"
import type { components } from "@/models/__generated__/schema"
import Overlay from "../components/composite/Overlay"
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline"
import Image from "next/image"


type Order = components["schemas"]["Order"]

interface OrderWithDetails extends Order {
  id: string
}

interface OrderCardProps {
  order: OrderWithDetails
  isOwner: boolean
  onAccept: (id: string) => void
  onDecline: (id: string) => void
}

const OrderCard = ({ order, isOwner, onAccept, onDecline }: OrderCardProps) => {
  const { id, reagent_id, status } = order
  
  return (
    <div className="w-full max-w-[19rem] md:h-[18.5rem] border-white/30 border-solid border-[1.5px] rounded-xl bg-primary/80">
      <div className="flex flex-row gap-4 md:gap-0 md:flex-col m-2 md:m-3 rounded-lg overflow-hidden drop-shadow-xl">
        
        <div className="relative w-[7rem] h-[6.5rem] md:w-full md:h-[8rem]">
          <Image 
            src="/placeholder.webp" 
            fill 
            className="object-cover rounded-lg" 
            alt="Reagent placeholder" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
            <div className="hidden md:block">
              <span className="bg-black/30 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                Order #{id.slice(-6)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between flex-1 gap-1 md:py-4">
          
          <div className="flex flex-col justify-between">
            <h4 className="text-white text-base md:text-xl italic">
              Order #{id.slice(-6)}
            </h4>

            <div className="md:hidden flex flex-wrap gap-1 mt-2">
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                #{id.slice(-6)}
              </span>
            </div>
          </div>

          <div className="hidden md:block bg-light-gray h-[1px] my-2"></div>

          <div className="flex items-center justify-between">
            
            <div className="flex flex-col">
              <p className="text-light-gray text-xs">
                <span className="text-white/60">Reagent ID: </span>
                <span className="text-white">{reagent_id.slice(-8)}</span>
              </p>
              
              <p className="text-light-gray text-xs mt-1">
                <span className="text-white/60">Status: </span>
                <span className="text-white capitalize">{status}</span>
              </p>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <button 
                  onClick={() => onAccept(id)} 
                  className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                  title="Accept order"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => onDecline(id)} 
                  className="flex items-center justify-center w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Decline order"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const user = getCurrentUser()
    setCurrentUser(user)
    if (user) {
      fetchOrders()
    }
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Please sign in to view your orders")
        setLoading(false)
        return
      }

      const { data, error } = await client.GET("/orders" as any, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (error) {
        alert("Failed to fetch orders")
        setLoading(false)
        return
      }

      const ordersWithDetails = (data || []).map((order: Order) => ({
        ...order,
        reagent: null 
      }))
      
      setOrders(ordersWithDetails)
    } catch (err) {
      alert("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const handleOrderAction = async (orderId: string, action: "accept" | "decline") => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        alert("Please sign in first")
        return
      }

      const { error } = await client.PUT(`/orders/${orderId}/${action}` as any, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (error) {
        throw new Error(`Failed to ${action} order`)
      }
      
      alert(`Order ${action}${action === "accept" ? "ed" : "d"} successfully!`)
      await fetchOrders() 
    } catch (err) {
      alert(`Failed to ${action} order`)
    }
  }

  const isOwner = (order: Order) => currentUser?.uid === order.owner_id

  //filter pending
  const pendingOrders = orders.filter(order => order.status === "pending")


  if (loading) {
    return (
      <Overlay>
        <div className="p-8 max-w-7xl mx-auto">
          <h2 className="text-white text-3xl font-medium mb-6">Orders</h2>
          <div className="flex items-center justify-center h-64 text-white">
            Loading orders...
          </div>
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">Orders</h1>
        
        {pendingOrders.length === 0 ? (
          <div className="bg-primary/50 rounded-lg p-8 border border-muted text-gray-400 text-center">
            <h3 className="text-lg font-medium mb-2">No Pending Orders</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {pendingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                isOwner={isOwner(order)}
                onAccept={id => handleOrderAction(id, "accept")}
                onDecline={id => handleOrderAction(id, "decline")}
              />
            ))}
          </div>
        )}
      </div>
    </Overlay>
  )
}
