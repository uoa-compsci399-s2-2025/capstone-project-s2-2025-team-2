"use client"
import Overlay from "@/app/components/composite/Overlay"
import client from "../services/fetch-client"
import { useState, useEffect, ElementType } from "react"
import { auth } from "@/app/config/firebase"
import { components } from "@/models/__generated__/schema"
import RecordCard from "../components/composite/history/RecordCard"
import LoadingState from "../components/composite/loadingstate/LoadingState"
import { usePagination } from "../hooks/usePagination"
import Pagination from "../components/composite/pagination/Pagination"
import {
  Square3Stack3DIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline"

type Order = components["schemas"]["Order"]
type Exchange = components["schemas"]["Exchange"]
type Trade = components["schemas"]["Trade"]
type OrderWithId = Order & {
  id: string
  reagentName: string
  ownerName: string
  requesterName: string
}

type HistoryFilter = "all" | "sent" | "received"

const historyFilters: {
  label: string
  filterValue: HistoryFilter
  icon: ElementType
}[] = [
  {
    label: "All",
    filterValue: "all",
    icon: Square3Stack3DIcon,
  },
  {
    label: "Sent",
    filterValue: "sent",
    icon: ArrowUpTrayIcon,
  },
  {
    label: "Received",
    filterValue: "received",
    icon: ArrowDownTrayIcon,
  },
]

const History = () => {
  const [orders, setOrders] = useState<OrderWithId[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setErr(null)

    const unsubscribe = auth.onAuthStateChanged(async (user: any) => {
      if (!user) {
        if (!cancelled) {
          setCurrentUserId(null)
          setErr("User not logged in")
          setOrders([])
          setIsLoading(false)
        }
        return
      }

      //current user id for filtering
      if (!cancelled) {
        setCurrentUserId(user.uid)
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
            ownerName: ownerMap[order.owner_id]?.displayName || "Unknown Owner",
            requesterName:
              requesterMap[order.requester_id]?.displayName ||
              "Unknown Requester",
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

  //filter orders based on tab
  const filteredOrders = orders.filter((order) => {
    if (historyFilter === "all") return true
    if (historyFilter === "sent")
      return order.requester_id === currentUserId
    if (historyFilter === "received")
      return order.owner_id === currentUserId
    return true
  })

  const pageSize = 8
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination(filteredOrders, pageSize)

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
      <p className="text-4xl text-white mt-4 ml-8">History</p>
      <div className="ml-8">
        <p className="text-purple-100 font-semibold inline">View</p>
        <p className="text-gray-100 inline"> Past Transactions</p>
      </div>

      {/*order tabs*/}
      <div className="mt-8 flex flex-col gap-4 mx-4 md:mx-8">
        <div className="flex justify-center gap-8 border-b-2 border-secondary/20">
          {historyFilters.map((filter) => {
            const isSelected = historyFilter === filter.filterValue
            return (
              <div key={filter.filterValue} className="relative flex-1 flex justify-center">
                <span className="hidden md:block">
                  <button
                    type="button"
                    className={`w-full px-4 py-3 text-sm transition-colors duration-200 ${
                      isSelected
                        ? "text-white font-semibold"
                        : "text-gray-100 hover:text-white"
                    }`}
                    onClick={() => setHistoryFilter(filter.filterValue)}
                  >
                    {filter.label}
                  </button>
                </span>

                {/*icons/no text for mobile view tabs*/}
                <span className="block md:hidden">
                  <button
                    type="button"
                    className={`flex items-center justify-center p-3 text-sm transition-colors duration-200 ${
                      isSelected
                        ? "text-white font-semibold"
                        : "text-gray-100 hover:text-white"
                    }`}
                    onClick={() => setHistoryFilter(filter.filterValue)}
                  >
                    <filter.icon className="w-5 h-5" />
                  </button>
                </span>

                {/*active tab is underlined*/}
                {isSelected && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-white" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-5"></div>
      <div className="mx-8 mt-4">
        <div className="text-white gap-2 flex flex-col">
          {filteredOrders.length === 0 ? (
            <div className="bg-primary/50 rounded-lg p-8 border border-muted text-gray-400 text-center">
              <h3 className="text-lg font-medium mb-2">No History Found.</h3>
              <p className="text-sm">
                {historyFilter === "all"
                  ? "Past requests tied to your account will appear here."
                  : historyFilter === "sent"
                    ? "You have not sent any requests yet."
                    : "You have not received any requests yet."}
              </p>
            </div>
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
                    createdAt={new Date(
                      (order.createdAt as any)._seconds * 1000,
                    ).toLocaleDateString()}
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
