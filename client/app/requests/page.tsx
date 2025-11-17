"use client"

import { useState, useEffect, useCallback, ElementType } from "react"
import Overlay from "../components/composite/Overlay"
import OrderCard from "../components/composite/order/OrderCard"
import OrderDetailsModal from "../components/composite/order/OrderDetailsModal"
import client from "../services/fetch-client"
import { useRouter } from "next/navigation"
import type { components } from "@/models/__generated__/schema"
import { usePageSize } from "../hooks/usePageSize"
import { usePagination } from "../hooks/usePagination"
import LoadingState from "../components/composite/loadingstate/LoadingState"
import { auth } from "@/app/config/firebase"
import { onAuthStateChanged } from "firebase/auth"
import {
  Square3Stack3DIcon,
  UserGroupIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & { id: string; owner_id: string }
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }
interface OrderWithReagentResponse extends OrderWithId {
  reagent?: Reagent | null
}

interface ModalState {
  isOpen: boolean
  order: OrderWithId | null
  reagent: ReagentWithId | null
}

type RequestFilter = "all" | "bounty" | "marketplace"

const requestFilters: {
  label: string
  filterValue: RequestFilter
  icon: ElementType
}[] = [
  {
    label: "All Requests",
    filterValue: "all",
    icon: Square3Stack3DIcon,
  },
  {
    label: "Marketplace",
    filterValue: "marketplace",
    icon: ShoppingCartIcon,
  },
  {
    label: "Bounty",
    filterValue: "bounty",
    icon: UserGroupIcon,
  },
]

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithId[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [reagents, setReagents] = useState<Map<string, ReagentWithId>>(
    new Map(),
  )
  const [loading, setLoading] = useState(true)
  const [requestFilter, setRequestFilter] = useState<RequestFilter>("all")
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    order: null,
    reagent: null,
  })
  const router = useRouter()

  //fetch userID of the logged in user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid)
      } else {
        setCurrentUserId(null)
      }
    })
    return () => unsubscribe()
  }, [])
  // fetch all orders where user is owner/requester
  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) {
      router.push("/auth")
      return
    }

    setLoading(true)
    try {
      const { data: ordersData = [] } = await client.GET(
        "/orders/pending" as any,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      console.log(ordersData)
      const ordersWithReagents = ordersData as OrderWithReagentResponse[]
      const reagentMap = new Map<string, ReagentWithId>()
      const ordersList: OrderWithId[] = []

      ordersWithReagents.forEach((orderData) => {
        const { reagent, ...order } = orderData
        ordersList.push(order)
        if (reagent) {
          reagentMap.set(order.reagent_id, {
            ...reagent,
            id: order.reagent_id,
          })
        }
      })

      setOrders(ordersList)
      setReagents(reagentMap)
    } catch (err) {
      console.error("Failed to fetch orders:", err)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // open order details modal
  const handleOrderDetails = (orderId: string) => {
    const order = orders.find((o) => o.id === orderId)
    const reagent = order ? reagents.get(order.reagent_id) : null

    if (order && reagent) {
      setModalState({ isOpen: true, order, reagent })
    }
  }

  const handleCloseModal = () => {
    setModalState({ isOpen: false, order: null, reagent: null })
  }

  //filter requests based on tab
  const filteredRequests = orders.filter((order) => {
    if (requestFilter === "all") return true
    const isBounty = !!(order as any).bounty_id
    if (requestFilter === "bounty") return isBounty
    if (requestFilter === "marketplace") return !isBounty
    return true
  })

  // pagination
  const pageSize = usePageSize()
  const { currentPage, setCurrentPage, totalPages } = usePagination(
    filteredRequests,
    pageSize,
  )

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (currentPage < 1) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages, setCurrentPage])

  return (
    <Overlay>
      <p className="text-4xl font-medium text-white mt-4 ml-4 md:ml-8 tracking-[0.05em]">
        Requests
      </p>
      <div className="ml-4 md:ml-0">
        <p className="md:ml-8 text-warning italic font-bold inline mr-2 tracking-[0.05em]">
          Manage & Track
        </p>
        <p className="text-gray-100 italic inline">Your Requested Reagents</p>
      </div>

      {/*request tabs*/}
      <div className="mt-8 flex flex-col gap-4 mx-4 md:mx-8">
        <div className="flex justify-center gap-8 border-b-2 border-secondary/20">
          {requestFilters.map((filter) => {
            const isSelected = requestFilter === filter.filterValue
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
                    onClick={() => setRequestFilter(filter.filterValue)}
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
                    onClick={() => setRequestFilter(filter.filterValue)}
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

      <div className="bg-transparent flex flex-wrap pt-[2rem] gap-4 mx-4 md:gap-[2rem] md:mx-[2rem] pb-[4rem]">
        {/*loading state*/}
        {loading ? (
          <LoadingState pageName="Requests" />
        ) : !filteredRequests.length ? (
          //no orders found
          <div className="bg-primary/50 rounded-lg p-8 border border-muted text-gray-400 text-center w-full">
            <h3 className="text-lg font-medium mb-2">No Requests Found.</h3>
            <p className="text-sm">
              {requestFilter === "all"
                ? "Pending reagent requests tied to your account will appear here."
                : requestFilter === "bounty"
                  ? "No bounty offers found."
                  : "No marketplace requests found."}
            </p>
          </div>
        ) : (
          <div className="bg-transparent flex flex-wrap gap-4 md:gap-[2rem] w-full">
            {filteredRequests.map((request) => {
              const reagent = reagents.get(request.reagent_id)
              if (!reagent) return null
              return (
                <OrderCard
                  key={request.id}
                  reagent={reagent}
                  order={request}
                  onViewDetails={handleOrderDetails}
                />
              )
            })}
          </div>
        )}
      </div>

      {/*  Pagination hidden for now
            {!loading && (
        <div className="pb-[4rem] md:pb-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      */}

      {/*request details modal*/}
      {modalState.order && modalState.reagent && (
        <OrderDetailsModal
          isOpen={modalState.isOpen}
          onClose={handleCloseModal}
          order={modalState.order}
          reagent={modalState.reagent}
        />
      )}
    </Overlay>
  )
}
