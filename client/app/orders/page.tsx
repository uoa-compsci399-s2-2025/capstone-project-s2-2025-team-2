"use client"

import { useState, useEffect, useCallback } from "react"
import Overlay from "../components/composite/Overlay"
import OrderCard from "../components/composite/order/OrderCard"
import client from "../services/fetch-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import type { components } from "@/models/__generated__/schema"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & { id: string; owner_id: string }
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithId[]>([])
  const [reagents, setReagents] = useState<Map<string, ReagentWithId>>(new Map())
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  //fetch all orders where user is owner/requester
  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return router.push("/auth")

    const { data: ordersData = [] } = await client.GET("/orders" as any, {
      headers: { Authorization: `Bearer ${token}` },
    })
    
    setOrders(ordersData as OrderWithId[])

    //fetch all reagents involved in orders, map ids
    const uniqueIds = [...new Set(ordersData.map((o: Order) => o.reagent_id))]
    const reagentData = await Promise.all(
      uniqueIds.map(async id => {
        const { data } = await client.GET(`/reagents/${id}` as any, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return data && { ...data, id } as ReagentWithId
      })
    )
    
    setReagents(new Map(reagentData.filter(Boolean).map(r => [r!.id, r!])))
    setLoading(false)
  }, [router])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  //handle approve/cancel order, send alert
  const handleAction = async (orderId: string, action: string) => {
    await client.PATCH(`/orders/${orderId}/${action}` as any, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    })
    await fetchOrders()
    toast(action === "approve" ? "Order approved!" : "Order canceled!")
  }

  return (
    <Overlay>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-6">Your Orders</h1>
        
        {/*loading state*/}
        {loading ? (
          <div className="text-white text-center">Loading orders...</div>
        ) : !orders.length ? (
          
          //no orders found
          <div className="bg-primary/50 rounded-lg p-8 border border-muted text-gray-400 text-center">
            <h3 className="text-lg font-medium mb-2">No Orders Found.</h3>
            <p className="text-sm">Orders tied to your account will appear here.</p>
          </div>
        ) : (
          
          //render order cards
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map(order => {
              const reagent = reagents.get(order.reagent_id)
              if (!reagent) return null
              return (
                <OrderCard
                  key={order.id}
                  reagent={reagent}
                  order={order}
                  onApprove={id => handleAction(id, "approve")}
                  onDecline={id => handleAction(id, "cancel")}
                />
              )
            })}
          </div>
        )}
      </div>
    </Overlay>
  )
}