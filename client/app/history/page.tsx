"use client"
import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { useState, useEffect } from "react"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"
import RecordCard from "../components/composite/history/RecordCard"

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
        <div>Loading...</div>
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
      <div className="m-4">
        <div className="text-white gap-2 flex flex-col">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <ul>
              {orders.map((order, index) => (
                <div
                  className="flex flex-col my-2 bg-primary rounded-md p-3"
                  key={order.reagent_id ?? index}
                >
                  <p>Order: {order.reagent_id}</p>
                  <p>Initiate Message:{order.message}</p>
                  <p>Quantity: {order.quantity}</p>
                  <p>Status: {order.status}</p>
                </div>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default History
