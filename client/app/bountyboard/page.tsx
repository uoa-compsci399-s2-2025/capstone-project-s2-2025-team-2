"use client"

import { useCallback, useEffect, useState } from "react"
import Overlay from "../components/composite/Overlay"
import client from "../services/fetch-client"
import WantedCard from "../components/composite/wantedreagent/WantedCard"
import SearchBar from "../components/composite/searchbar/SearchBar"
import { WantedForm } from "../components/composite/wantedreagent/WantedForm"
import { usePagination } from "../hooks/usePagination"
import Pagination from "../components/composite/pagination/Pagination"
import LoadingState from "../components/composite/loadingstate/LoadingState"

type ReagentCategory = "chemical" | "hazardous" | "biological"
type ReagentTradingType = "trade" | "giveaway" | "sell"

type FirestoreWantedReagent = {
  user_id: string
  id: string
  categories: ReagentCategory[]
  createdAt: any
  createdAtReadable: string
  description: string
  location: string
  name: string
  price: number
  tradingType: ReagentTradingType
  expiryDate: string
}

type EnrichedWantedReagent = FirestoreWantedReagent & {
  requesterInfo?: any
  offeredReagentName?: string | null
}

type Offer = {
  id: string
  requester_id: string
  reagent_id: string
  owner_id: string
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
  quantity?: number
  unit?: string
  offeredReagentId: string
}

const BountyBoard = () => {
  const [wanted, setWanted] = useState<EnrichedWantedReagent[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [offers, setOffers] = useState<Offer[]>([])
  const [sort, setSort] = useState<
    "earliestExpiry" | "latestExpiry" | "nameAZ" | "nameZA" | ""
  >("earliestExpiry")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchWantedReagents = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch wanted reagents
      const { data } = await client.GET("/wanted" as any, {})
      const reagents = (data as FirestoreWantedReagent[]) || []

      // Get unique user IDs
      const uniqueUserIds = [...new Set(reagents.map((r) => r.user_id))]

      // Fetch all users in parallel
      const userDataPromises = uniqueUserIds.map((userId) =>
        client.GET(`/users/${userId}` as any, {}),
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

      // Fetch offered reagent names for trades in parallel
      const enrichedData = await Promise.all(
        reagents.map(async (reagent) => {
          let offeredReagentName = null
          if (
            reagent.tradingType === "trade" &&
            (reagent as any).requesterOfferedReagentId
          ) {
            try {
              const resp = await client.GET(
                `/reagents/${(reagent as any).requesterOfferedReagentId}` as any,
                {},
              )
              if (resp.data?.name) {
                offeredReagentName = resp.data.name
              }
            } catch (err) {
              console.error("Failed to fetch offered reagent:", err)
            }
          }

          return {
            ...reagent,
            requesterInfo: userMap.get(reagent.user_id),
            offeredReagentName,
          }
        }),
      )

      setWanted(enrichedData)
    } catch (error) {
      console.error("Failed to fetch wanted reagents:", error)
      setWanted([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchOffers = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken")
      const { data } = await client.GET("/offers" as any, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setOffers((data as Offer[]) || [])
    } catch (error) {
      console.error("Failed to fetch offers:", error)
      setOffers([])
    }
  }, [])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsFormOpen(false)
    }
  }

  useEffect(() => {
    fetchWantedReagents()
    fetchOffers()
    try {
      const token = localStorage.getItem("authToken")
      setIsSignedIn(!!token)
    } catch {
      setIsSignedIn(false)
    }
  }, [fetchWantedReagents, fetchOffers])

  const handleFormSubmit = async () => {
    await fetchWantedReagents()
    setIsFormOpen(false)
  }

  // Filter out wanted reagents with approved offers
  const availableWanted = wanted.filter((wantedReagent) => {
    const hasApprovedOffer = offers.some(
      (offer) =>
        offer.reagent_id === wantedReagent.id && offer.status === "approved",
    )
    return !hasApprovedOffer
  })

  const filtered = availableWanted.filter((r) => {
    const query = search.trim().toLowerCase()
    if (!query) return true

    switch (filter) {
      case "tag":
      case "category":
        return (
          Array.isArray(r.categories) &&
          r.categories.some((c) => c.toLowerCase().includes(query))
        )
      case "expiryDate":
        return (r.expiryDate ?? "").toLowerCase().includes(query)
      case "location":
        return (r.location ?? "").toLowerCase().includes(query)
      case "tradingType":
        return (r.tradingType ?? "").toLowerCase().includes(query)
      default:
        return (r.name ?? "").toLowerCase().includes(query)
    }
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "earliestExpiry":
      case "latestExpiry": {
        const getTimestamp = (item: FirestoreWantedReagent): number => {
          const date = item.createdAt

          if (!date) return 0

          if (typeof date === "object" && "_seconds" in date) {
            return date._seconds * 1000 + (date._nanoseconds || 0) / 1e6
          }

          if (
            typeof date === "object" &&
            "toMillis" in date &&
            typeof date.toMillis === "function"
          ) {
            return date.toMillis()
          }

          if (typeof date === "string") {
            const parsed = new Date(date).getTime()
            return isNaN(parsed) ? 0 : parsed
          }

          if (date instanceof Date) return date.getTime()

          if (typeof date === "number") return date

          return 0
        }

        const aTime = getTimestamp(a)
        const bTime = getTimestamp(b)

        if (aTime === 0 && bTime === 0) return a.name.localeCompare(b.name)
        if (aTime === 0) return 1
        if (bTime === 0) return -1

        return sort === "earliestExpiry" ? bTime - aTime : aTime - bTime
      }

      case "nameAZ":
        return (a.name || "").localeCompare(b.name || "")

      case "nameZA":
        return (b.name || "").localeCompare(a.name || "")

      default:
        return 0
    }
  })

  const pageSize = 12
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagination(sorted, pageSize)

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
        Bounty Board
      </p>
      <div className="ml-4 md:ml-0">
        <p className="md:ml-8 text-warning italic font-bold inline mr-2 tracking-[0.05em]">
          Reagents Wanted
        </p>
        <p className="text-gray-100 italic inline">by Other Users</p>
      </div>
      <div className="mt-5"></div>

      <div className="bg-transparent pt-[2rem] mx-4 md:gap-[2rem] md:mx-[2rem]">
        <SearchBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div className="bg-transparent grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pt-[2rem] gap-y-2.5 md:gap-x-4 md:gap-y-3 lg:gap-x-6 mx-4 md:mx-[2rem] pb-[4rem]">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center min-h-[300px]">
            <LoadingState pageName="Bounty Board" />
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center text-white/60 py-12 col-span-full">
            <p className="text-lg">No bounties found</p>
          </div>
        ) : (
          currentData.map((reagent) => (
            <WantedCard
              key={reagent.id}
              wanted={reagent}
              requesterInfo={reagent.requesterInfo}
              offeredReagentName={reagent.offeredReagentName}
              showContactButton={true}
            />
          ))
        )}
      </div>

      <div className="pb-[4rem] md:pb-0">
        {!isLoading && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      {isSignedIn && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-blue-primary hover:bg-blue-primary/90 text-white rounded-full transition-all duration-200 flex items-center text-3xl justify-center hover:scale-110 active:scale-95 group z-50"
        >
          +
        </button>
      )}
      {isFormOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 "
          onClick={handleBackdropClick}
        >
          <div className="bg-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-medium text-white">
                Create Reagent Bounty
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 text-3xl hover:text-white "
              >
                ❌
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              <WantedForm
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </Overlay>
  )
}

export default BountyBoard
