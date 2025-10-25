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
import Pagination from "../components/composite/pagination/Pagination"
import LoadingState from "../components/composite/loadingstate/LoadingState"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & { id: string; owner_id: string }
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface ModalState {
  isOpen: boolean
  order: OrderWithId | null
  reagent: ReagentWithId | null
}

export default function Orders() {
  const [orders, setOrders] = useState<OrderWithId[]>([])
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

  //fetch all orders where user is owner/requester
  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem("authToken")
    if (!token) return router.push("/auth")

    const { data: ordersData = [] } = await client.GET("/orders" as any, {
      headers: { Authorization: `Bearer ${token}` },
    })

    //only show pending orders
    const pendingOrders = (ordersData as OrderWithId[]).filter(order => order.status === "pending")
    setOrders(pendingOrders)

    //fetch all reagents involved in orders, map ids
    const uniqueIds = [...new Set(pendingOrders.map((o: Order) => o.reagent_id))]
    const reagentData = await Promise.all(
      uniqueIds.map(async (id) => {
        const { data } = await client.GET(`/reagents/${id}` as any, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return data && ({ ...data, id } as ReagentWithId)
      }),
    )

    setReagents(new Map(reagentData.filter(Boolean).map((r) => [r!.id, r!])))
    setLoading(false)
  }, [router])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  //open order details modal
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
  }, [currentPage, totalPages])
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

      <div className="mt-5"></div>

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
          //render order cards
          orders.map((order) => {
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
          })
        )}
      </div>
      {!loading && (
        <div className="pb-[4rem] md:pb-0">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
