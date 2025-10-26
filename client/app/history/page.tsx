"use client"
import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { useState, useEffect } from "react"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"
import RecordCard from "../components/composite/history/RecordCard"
import LoadingState from "../components/composite/loadingstate/LoadingState"
import { usePagination } from "../hooks/usePagination"
import Pagination from "../components/composite/pagination/Pagination"

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
          const reagentIds = [...new Set(ordersData.map((o) => o.reagent_id))]
          const ownerIds = [...new Set(ordersData.map((o) => o.owner_id))]
          const requesterIds = [
            ...new Set(ordersData.map((o) => o.requester_id)),
          ]

          const [reagentRes, ownerRes, requesterRes] = await Promise.all([
            Promise.all(
              reagentIds.map((reagentId) => {
                const res = client.GET(`/reagents/${reagentId}` as any, {
                  Authorization: `Bearer ${token}`,
                })
                return res
              }),
            ),
            Promise.all(
              ownerIds.map((id) => {
                const res = client.GET(`/users/${id}` as any, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                return res
              }),
            ),
            Promise.all(
              requesterIds.map((id) => {
                const res = client.GET(`/users/${id}` as any, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                return res
              }),
            ),
          ])
          
          const reagentMap = Object.fromEntries(
            reagentRes.map((res, i) => [reagentIds[i], res.data]),
          )
          const ownerMap = Object.fromEntries(
            ownerRes.map((res, i) => [ownerIds[i], res.data]),
          )
          const requesterMap = Object.fromEntries(
            requesterRes.map((res, i) => [requesterIds[i], res.data]),
          )
          const ordersWithInfo = ordersData.map((order) => ({
            ...order,
            reagentName:
              reagentMap[order.reagent_id]?.name || "Deleted Reagent",
            ownerName: ownerMap[order.owner_id]?.displayName || ownerMap[order.owner_id]?.preferredName || "Unknown Owner",
            requesterName:
              requesterMap[order.requester_id]?.displayName || requesterMap[order.requester_id]?.preferredName || "Unknown Requester",
          }))
          setOrders(ordersWithInfo)
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

  const pageSize = 8
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination(orders, pageSize)

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (currentPage < 1) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])
  
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
      <p className="text-4xl font-medium text-white mt-4 ml-8 tracking-[0.05em]">
        History
      </p>
      <div className="ml-8">
        <p className="text-blue-primary italic font-bold inline mr-2 tracking-[0.05em]">
          View
        </p>
        <p className="text-gray-100 italic inline">Past orders</p>
      </div>

      <div className="mt-5"></div>
      <div className="mx-8 mt-4">
        <div className="text-white gap-2 flex flex-col">
          {orders.length === 0 ? (
            <p>No orders found</p>
          ) : (
            <div className="flex flex-col gap-4 pb-[4rem]">
              {currentData.map((order) => {
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
      <div className="pb-[4rem] md:pb-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </Overlay>
  )
}

export default History
