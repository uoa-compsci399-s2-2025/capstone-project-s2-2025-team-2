"use client"
import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { useState } from "react"
import { useEffect } from "react"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"

type Order = components["schemas"]["Order"]

const fetchHistory = async () => {
  const response = await client.GET("/orders", {
    headers: {
      Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
    },
  })
  return response.data as Order[]
}

const History = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true)
        const data = await fetchHistory()
        setOrders(data || [])
      } catch (err) {
        setErr("400, failed to fetch orders")
      } finally {
        setIsLoading(false)
      }
    }
    loadOrders()
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
      <div>
        {" "}
        <div>
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <ul>
              {orders.map((order, index) => (
                <li key={index}>
                  <div>Order: {order.reagent_id}</div>
                  <div>Initiate Message:{order.message}</div>
                  <div>Quantity: {order.quantity}</div>
                  <div>Status: {order.status}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default History
