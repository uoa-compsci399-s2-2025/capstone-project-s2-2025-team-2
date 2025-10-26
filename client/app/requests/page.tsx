"use client"

import { useState, useEffect, useCallback } from "react"
import Overlay from "../components/composite/Overlay"
import OrderCard from "../components/composite/order/OrderCard"
import WantedCard from "../components/composite/wantedreagent/WantedCard"
import OrderDetailsModal from "../components/composite/order/OrderDetailsModal"
import client from "../services/fetch-client"
import { useRouter } from "next/navigation"
import type { components } from "@/models/__generated__/schema"
import { usePageSize } from "../hooks/usePageSize"
import { usePagination } from "../hooks/usePagination"
import Pagination from "../components/composite/pagination/Pagination"
import LoadingState from "../components/composite/loadingstate/LoadingState"
import { auth } from "@/app/config/firebase"
import { onAuthStateChanged } from "firebase/auth"

type Order = components["schemas"]["Order"]
type OrderWithId = Order & { id: string; owner_id: string }
type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface EnrichedWantedReagent {
  id: string
  name: string
  description: string
  createdAt: string
  createdAtReadable: string
  user_id: string
  price?: number
  categories: any[]
  tradingType: string
  location: string
  expiryDate: string
  requesterInfo?: any
  offeredReagentName?: string | null
}
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
  const [reagents, setReagents] = useState<Map<string, ReagentWithId>>(
    new Map(),
  )
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [offers, setOffers] = useState<any[]>([])
  const [wantedReagents, setWantedReagents] = useState<
    Map<string, EnrichedWantedReagent>
  >(new Map())
  const [offerModalState, setOfferModalState] = useState<{
    isOpen: boolean
    offer: any | null
    wanted: EnrichedWantedReagent | null
  }>({
    isOpen: false,
    offer: null,
    wanted: null,
  })
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    order: null,
    reagent: null,
  })
  const router = useRouter()

  //open offer details modal
  const handleOfferDetails = (offerId: string) => {
    const offer = offers.find((o) => o.id === offerId)
    const wanted = offer ? wantedReagents.get(offer.reagent_id) : null

    if (offer && wanted) {
      setOfferModalState({ isOpen: true, offer, wanted })
    }
  }

  const handleCloseOfferModal = () => {
    setOfferModalState({ isOpen: false, offer: null, wanted: null })
  }

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
            //fetch all wanted reagents involved in offers
      const uniqueWantedIds = [
        ...new Set(offersData.map((o: any) => o.reagent_id)),
      ]

      if (uniqueWantedIds.length > 0) {
        // Fetch wanted reagents
        const wantedReagentData = await Promise.all(
          uniqueWantedIds.map(async (id) => {
            const { data } = await client.GET(`/wanted/${id}` as any, {
              headers: { Authorization: `Bearer ${token}` },
            })
            return data ? ({ ...data, id } as any) : null
          }),
        )

        const validWantedReagents = wantedReagentData.filter(Boolean)

        // Get unique user IDs from wanted reagents
        const uniqueUserIds = [
          ...new Set(validWantedReagents.map((r) => r.user_id)),
        ]

        // Fetch all users in parallel
        const userDataPromises = uniqueUserIds.map((userId) =>
          client.GET(`/users/${userId}` as any, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        )
        const userResults = await Promise.allSettled(userDataPromises)

        // Create a map of userId -> userData
        const userMap = new Map()
        uniqueUserIds.forEach((userId, index) => {
          const result = userResults[index]
          if (result.status === "fulfilled" && result.value.data) {
            userMap.set(userId, result.value.data)
          }
        })

        // Enrich wanted reagents with user info and offered reagent names
        const enrichedWantedReagents = await Promise.all(
          validWantedReagents.map(async (wanted) => {
            let offeredReagentName = null
            if (
              wanted.tradingType === "trade" &&
              wanted.requesterOfferedReagentId
            ) {
              try {
                const resp = await client.GET(
                  `/reagents/${wanted.requesterOfferedReagentId}` as any,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  },
                )
                if (resp.data?.name) {
                  offeredReagentName = resp.data.name
                }
              } catch (err) {
                console.error("Failed to fetch offered reagent:", err)
              }
            }

            return {
              ...wanted,
              requesterInfo: userMap.get(wanted.user_id),
              offeredReagentName,
            } as EnrichedWantedReagent
          }),
        )

        setWantedReagents(new Map(enrichedWantedReagents.map((r) => [r.id, r])))
      }
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
      {!loading && (
        <h2 className="text-2xl text-white pt-[2rem] gap-4 mx-4 md:gap-[2rem] md:mx-[2rem]">
          From Marketplace
        </h2>
      )}
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
        {offers.length > 0 && (
          <div className="w-full">
            {!loading && (
              <h2 className="text-2xl font-medium text-white mb-[2.5rem] mt-[2rem]">
                From Bounty Board
              </h2>
            )}
            {!loading && (
              <div className="text-xl font-medium text-white mb-[1rem]">
                Offers You Received
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-x-4 md:gap-y-3 lg:gap-x-6">
              {offers
                .filter(
                  (offer) =>
                    offer.status !== "approved" &&
                    offer.owner_id === currentUserId,
                )
                .map((offer) => {
                  const wanted = wantedReagents.get(offer.reagent_id)
                  if (!wanted) return null
                  return (
                    <WantedCard
                      key={offer.id}
                      wanted={{
                        ...wanted,
                        tradingType:
                          wanted.tradingType as import("@/models/__generated__/schema").components["schemas"]["ReagentTradingType"],
                      }}
                      requesterInfo={wanted.requesterInfo}
                      offeredReagentName={wanted.offeredReagentName}
                      offer={offer}
                      onViewDetails={handleOfferDetails}
                    />
                  )
                })}
            </div>
            {!loading && (
              <div className="text-xl font-medium text-white mb-4 mt-[2rem]">
                Offers You Sent
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-x-4 md:gap-y-3 lg:gap-x-6">
              {offers
                .filter(
                  (offer) =>
                    offer.status !== "approved" &&
                    offer.owner_id !== currentUserId,
                )
                .map((offer) => {
                  const wanted = wantedReagents.get(offer.reagent_id)
                  if (!wanted) return null
                  return (
                    <WantedCard
                      key={offer.id}
                      wanted={{
                        ...wanted,
                        tradingType:
                          wanted.tradingType as import("@/models/__generated__/schema").components["schemas"]["ReagentTradingType"],
                      }}
                      requesterInfo={wanted.requesterInfo}
                      offeredReagentName={wanted.offeredReagentName}
                      offer={offer}
                      onViewDetails={handleOfferDetails}
                    />
                  )
                })}
            </div>
          </div>
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
      {/* Offer details modal */}
      {offerModalState.offer && offerModalState.wanted && (
        <OrderDetailsModal
          isOpen={offerModalState.isOpen}
          onClose={handleCloseOfferModal}
          order={offerModalState.offer}
          reagent={offerModalState.wanted}
          isOfferDetails={true}
        />
      )}
    </Overlay>
  )
}
