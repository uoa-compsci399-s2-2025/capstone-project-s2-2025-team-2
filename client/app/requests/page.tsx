"use client"

import { useState, useEffect, useCallback } from "react"
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

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithId[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [reagents, setReagents] = useState<Map<string, ReagentWithId>>(
    new Map(),
  )
  const [loading, setLoading] = useState(true)
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

  // pagination
  const pageSize = usePageSize()
  const { currentPage, setCurrentPage, totalPages } = usePagination(
    orders,
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
      <p className="text-4xl text-white mt-4 ml-4 md:ml-8">
        Requests
      </p>
      <div className="ml-4 md:ml-0">
        <p className="md:ml-8 text-purple-100 font-semibold inline">
          Manage & Track
        </p>
        <p className="text-gray-100 inline"> Your Reagent Transactions</p>
      </div>

      <div className="mt-4"></div>
      <div className="bg-transparent flex flex-wrap pt-[2rem] gap-4 mx-4 md:gap-[2rem] md:mx-[2rem] pb-[4rem]">
        {/*loading state*/}
        {loading ? (
          <LoadingState pageName="Requests" />
        ) : !orders.length ? (
          //no orders found
          <div className="bg-primary/50 rounded-lg p-8 border border-muted text-gray-400 text-center w-full">
            <h3 className="text-lg font-medium mb-2">No Requests Found.</h3>
            <p className="text-sm">
              Pending reagent requests tied to your account will appear here.
            </p>
          </div>
        ) : (
          <div className="w-full">
            {orders.filter((order) => order.owner_id === currentUserId).length >
              0 && (
              <div>
                <div className="text-xl font-medium text-white mb-4">
                  Requests You Received
                </div>
                <div className="bg-transparent flex flex-wrap gap-4 md:gap-[2rem] pb-[1rem]">
                  {orders
                    .filter((order) => order.owner_id === currentUserId)
                    .map((order) => {
                      const reagent = reagents.get(order.reagent_id)
                      if (!reagent) return null
                      return (
                        <OrderCard
                          key={order.id}
                          reagent={reagent}
                          order={order}
                          onViewDetails={handleOrderDetails}
                        />
                      )
                    })}
                </div>
              </div>
            )}

            {orders.filter((order) => order.owner_id !== currentUserId).length >
              0 && (
              <div>
                <div className="text-xl font-medium text-white mb-4 mt-[1rem]">
                  Requests You Sent
                </div>
                <div className="bg-transparent flex flex-wrap gap-4 md:gap-[2rem]">
                  {orders
                    .filter((order) => order.owner_id !== currentUserId)
                    .map((order) => {
                      const reagent = reagents.get(order.reagent_id)
                      if (!reagent) return null
                      return (
                        <OrderCard
                          key={order.id}
                          reagent={reagent}
                          order={order}
                          onViewDetails={handleOrderDetails}
                        />
                      )
                    })}
                </div>
              </div>
            )}
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
