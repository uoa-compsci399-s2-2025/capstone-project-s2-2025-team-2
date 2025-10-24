"use client"
import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { useState, useEffect } from "react"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"
import RecordCard from "../components/composite/history/RecordCard"
import LoadingState from "../components/composite/loadingstate/LoadingState"

type Order = components["schemas"]["Order"]

const History = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setErr(null)

    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (!user) {
        if (!cancelled) {
          setErr("User not logged in")
          setOrders([])
          setIsLoading(false)
        }
        return
      }

      try {
        const token = await user.getIdToken()
        const response = await client.GET("/orders", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!cancelled) {
          setOrders(response.data || [])
          setErr(null)
        }
      } catch (e) {
        console.error("fetch orders failed", e)
        if (!cancelled) setErr("Failed to fetch orders")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  if (isLoading) {
    return (
      <Overlay>
        <div className="flex flex-col justify-center w-full h-[100vh]">
          <LoadingState pageName="History" />
        </div>
      </Overlay>
    )
  }
  if (err) {
    return (
      <Overlay>
        <div>{err}</div>
      </Overlay>
    )
  }
  return (
    <Overlay>
      <div className="mx-8 mt-4">
        <div className="text-white gap-2 flex flex-col">
          <p className="text-4xl">History</p>
          <p className="text-warning italic font-bold inline mr-2 my-2">View</p>
          <p className="text-gray-100 italic inline">Past orders</p>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order, index) => (
                <RecordCard
                  key={order.reagent_id}
                  orderId={order.reagent_id}
                  name="name"
                  status={order.status}
                  createdAt={new Date(order.createdAt).toLocaleDateString()}
                  // price={order.price || undefined}
                  quantity={order.quantity || 0}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default History
