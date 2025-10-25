"use client"
import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { useState, useEffect } from "react"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"
import RecordCard from "../components/composite/history/RecordCard"
import LoadingState from "../components/composite/loadingstate/LoadingState"

type Order = components["schemas"]["Order"]
type Exchange = components["schemas"]["Exchange"]
type Trade = components["schemas"]["Trade"]
type OrderWithId = Order & {
  id: string
  reagentName: string
  ownerName: string
  requesterName: string
}

const History = () => {
  const [orders, setOrders] = useState<OrderWithId[]>([])
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
          const ordersData = response.data as OrderWithId[]
          const ordersWithInfo = await Promise.all(
            ordersData.map(async (order) => {
              try {
                const reagentResponse = await client.GET(
                  `/reagents/${order.reagent_id}` as any,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                )
                const ownerResponse = await client.GET(
                  `/users/${order.owner_id}` as any,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                )

                const requesterResponse = await client.GET(
                  `/users/${order.requester_id}` as any,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                )
                return {
                  ...order,
                  reagentName: reagentResponse.data?.name || "Reagent Deleted",
                  ownerName: ownerResponse.data?.displayName || "Unknown Owner",
                  requesterName:
                    requesterResponse.data?.displayName || "Unknown Requester",
                }
              } catch (e) {
                console.error("fetch owner name failed", e)
                return { ...order, ownerName: "Unknown" }
              }
            }),
          )
          setOrders(ordersWithInfo)
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
        <div className="flex flex-col text-white items-center justify-center w-full h-[100vh]">
          {err}!
        </div>
      </Overlay>
    )
  }
  return (
    <Overlay>
      <div className="mx-8 mt-4">
        <div className="text-white gap-2 flex flex-col">
          <p className="text-4xl">History</p>
          <span>
            <p className="text-blue-primary italic font-bold inline mr-2 my-2">
              View
            </p>
            <p className="text-gray-100 italic inline">Past orders</p>
          </span>

          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const isTrade = "price" in order
                const isExchange = "offeredReagentId" in order

                return (
                  <RecordCard
                    key={order.id}
                    orderId={order.id}
                    ownerName={order.ownerName}
                    requesterName={order.requesterName}
                    reagentId={order.reagent_id}
                    reagentName={order.reagentName}
                    status={order.status}
                    createdAt={new Date(order.createdAt).toLocaleDateString()}
                    price={isTrade ? (order as Trade).price : undefined}
                    offeredReagentId={
                      isExchange
                        ? (order as Exchange).offeredReagentId
                        : undefined
                    }
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  )
}

export default History
