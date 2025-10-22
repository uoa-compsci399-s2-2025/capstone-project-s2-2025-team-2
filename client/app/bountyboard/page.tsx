"use client"

import { useCallback, useEffect, useState } from "react"
import Overlay from "../components/composite/Overlay"
import client from "../services/fetch-client"
import WantedCard from "../components/composite/wantedreagent/WantedCard"
import SearchBar from "../components/composite/searchbar/SearchBar"
import { WantedForm } from "../components/composite/wantedreagent/WantedForm"
import { usePagination } from "../hooks/usePagination"
import Pagination from "../components/composite/pagination/Pagination"

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
}

type Offer = {
  id: string
  requester_id: string // offerer_id the user who makes the offer
  reagent_id: string
  owner_id: string // the user who wants a reagent
  status: "pending" | "approved" | "canceled"
  createdAt: Date
  message?: string
  quantity?: number
  unit?: string
  offeredReagentId: string
}

const BountyBoard = () => {
  const [wanted, setWanted] = useState<FirestoreWantedReagent[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [offers, setOffers] = useState<Offer[]>([])
  const [sort, setSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const fetchWantedReagents = useCallback(async () => {
    try {
      const { data } = await client.GET("/wanted" as any, {

      })
      setWanted((data as FirestoreWantedReagent[]) || [])
    } catch (error) {
      console.error("Failed to fetch wanted reagents:", error)
      setWanted([])
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
        offer.reagent_id === wantedReagent.id && offer.status === "approved"
    )
    return !hasApprovedOffer
  })
useEffect(() => {
  console.log('All wanted:', wanted.length);
  console.log('All offers:', offers.length);
  console.log('Approved offers:', offers.filter(o => o.status === 'approved'));
  console.log('Available wanted:', availableWanted.length);
  
  // Check specific matches
  wanted.forEach(w => {
    const matchingOffer = offers.find(o => o.reagent_id === w.id);
    if (matchingOffer) {
      console.log(`Wanted ${w.name} (${w.id}) has offer:`, matchingOffer);
    }
  });
}, [wanted, offers]);
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
      case "date":
        return (r.createdAt ?? "").toLowerCase().includes(query)
      default:
        return (r.name ?? "").toLowerCase().includes(query)
    }
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest":
      case "oldest": {
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

        return sort === "newest" ? bTime - aTime : aTime - bTime
      }
      case "nameAZ":
        return (a.name || "").localeCompare(b.name || "")

      case "nameZA":
        return (b.name || "").localeCompare(a.name || "")

      default:
        return 0
    }
  })

  const pageSize = 6
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

      <div className="bg-transparent flex flex-wrap pt-[2rem] gap-2 mx-4 md:mx-[2rem] pb-[4rem]">
        {currentData.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <p className="text-lg">No wanted reagents found</p>
          </div>
        ) : (
          currentData.map((reagent) => (
            <WantedCard
              key={reagent.id}
              wanted={reagent}
              showContactButton={true}
            />
          ))
        )}
      </div>

      <div className="pb-[4rem] md:pb-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
                Post a Wanted Reagent
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
