"use client"
import { useCallback, useEffect, useState } from "react"
import Overlay from "../components/composite/Overlay"
import SearchBar from "../components/composite/searchbar/SearchBar"
import ReagentCard from "../components/composite/reagent/ReagentCard"
import ReagentForm from "../components/composite/reagent/ReagentForm"
import { usePagination } from "../hooks/usePagination"
import Pagination from "../components/composite/pagination/Pagination"
import { usePageSize } from "../hooks/usePageSize"
import client from "../services/fetch-client"
import LoadingState from "../components/composite/loadingstate/LoadingState"

type FirestoreReagent = {
  id: string
  categories: string[]
  condition: string
  createdAt: any
  createdAtReadable: string
  description: string
  expiryDate: string
  images: string[]
  location: string
  name: string
  price: number
  quantity: number
  tradingType: string
  unit: string
  user_id: string
  visibility: string
}

const Marketplace = () => {
  const [reagents, setReagents] = useState<FirestoreReagent[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const fetchReagents = useCallback(async () => {
    try {
      const { data } = await client.GET("/reagents", {})
      setReagents((data as FirestoreReagent[]) || [])
    } catch (error) {
      console.error("Failed to fetch reagents:", error)
      setReagents([])
    }
  }, [])

  useEffect(() => {
    fetchReagents()
    // Check if user is signed in
    try {
      const token = localStorage.getItem("authToken")
      setIsSignedIn(!!token)
    } catch {
      setIsSignedIn(false)
    }
  }, [fetchReagents])

  const handleFormSubmit = async () => {
    await fetchReagents()
    setIsFormOpen(false)
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsFormOpen(false)
    }
  }

  const filtered = reagents.filter((r) => {
    // Private listings are hidden from public marketplace
    if (r.visibility === "private") return false

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
        return (r.expiryDate ?? "").toLowerCase().includes(query)
      default:
        return (r.name ?? "").toLowerCase().includes(query)
    }
  })

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest":
      case "oldest": {
        const getTimestamp = (item: FirestoreReagent): number => {
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

  const pageSize = usePageSize()
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
        Marketplace
      </p>
      <div className="ml-4 md:ml-0">
        <p className="md:ml-8 text-warning italic font-bold inline mr-2 tracking-[0.05em]">
          Buy, Sell & Exchange
        </p>
        <p className="text-gray-100 italic inline">Laboratory Reagents</p>
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

      <div className="bg-transparent flex flex-wrap pt-[2rem] gap-4 mx-4 md:gap-[2rem] md:mx-[2rem] pb-[4rem]">
        {currentData.length > 0 ? (
          currentData.map((r) => {
            const allowedTradingTypes = ["trade", "giveaway", "sell"] as const
            const tradingType = allowedTradingTypes.includes(
              r.tradingType as any,
            )
              ? (r.tradingType as "trade" | "giveaway" | "sell")
              : "trade"

            const allowedCategories = [
              "chemical",
              "hazardous",
              "biological",
            ] as const
            const categories = Array.isArray(r.categories)
              ? r.categories.filter(
                  (c): c is (typeof allowedCategories)[number] =>
                    allowedCategories.includes(c as any),
                )
              : []

            const allowedVisibility = [
              "everyone",
              "region",
              "institution",
              "private",
            ] as const
            const visibility = allowedVisibility.includes(r.visibility as any)
              ? (r.visibility as (typeof allowedVisibility)[number])
              : undefined

            return (
              <ReagentCard
                key={r.id}
                reagent={{
                  ...r,
                  tradingType,
                  categories,
                  visibility,
                }}
              />
            )
          })
        ) : search.trim() === "" ? (
          <LoadingState pageName="Marketplace" />
        ) : (
          <div className="flex justify-center w-full items-center h-[40vh] text-gray-400 italic">
            No reagents found for &quot;{search}&quot;
          </div>
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
                List New Reagent
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 text-3xl hover:text-white "
              >
                ❌
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <ReagentForm
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

export default Marketplace
