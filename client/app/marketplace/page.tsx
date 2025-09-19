"use client"
import { useCallback, useEffect, useState } from "react"
import Overlay from "../components/composite/Overlay"
import SearchBar from "../components/composite/searchbar/SearchBar"
import ReagentCard from "../components/composite/reagent/ReagentCard"
import ReagentForm from "../components/composite/reagent/ReagentForm"
import { components } from "@/models/__generated__/schema"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }
import client from "../services/fetch-client"

const Marketplace = () => {
  const [reagents, setReagents] = useState<ReagentWithId[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [isFormOpen, setIsFormOpen] = useState(false)

  const fetchReagents = useCallback(async () => {
    const { data } = await client.GET("/reagents" as any, {})
    setReagents(data)
  }, [])

  useEffect(() => {
    fetchReagents()
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
    const query = search.trim().toLowerCase()
    if (!query) return true

    switch (filter) {
      case "tag":
        return (
          Array.isArray(r.categories) &&
          r.categories.some((c) => c.toLowerCase().includes(query))
        )
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
        return a.expiryDate.localeCompare(b.expiryDate)
      case "oldest":
        return b.expiryDate.localeCompare(a.expiryDate)
      case "nameAZ":
        return a.name.localeCompare(b.name)
      case "nameZA":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })

  return (
    <Overlay>
      <p className="text-4xl font-medium text-white mt-4 ml-4 md:ml-8 tracking-[0.05em]">
        Marketplace
      </p>
      <p className="ml-4 md:ml-8 text-warning italic font-bold inline mr-2 tracking-[0.05em]">
        Buy, Sell & Exchange
      </p>
      <p className="text-gray-100 italic inline">Laboratory Reagents</p>

      <div className="mt-5"></div>

      <div className="bg-transparent flex flex-wrap pt-[2rem] gap-4 mx-4 md:gap-[2rem] md:mx-[2rem]">
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
        {sorted.map((r) => (
          <ReagentCard
            key={r.id}
            name={r.name}
            tags={Array.isArray(r.categories) ? r.categories : []}
            location={r.location ?? "Unknown"}
            expiryDate={r.expiryDate ?? "N/A"}
            imageUrl={
              r.images?.[0] !== "string"
                ? (r.images?.[0] ?? "/placeholder.webp")
                : "/placeholder.webp"
            }
            type={r.tradingType ?? "sell"}
            id={r.id}
          />
        ))}
      </div>

      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-primary hover:bg-blue-primary/90 text-white rounded-full transition-all duration-200 flex items-center text-3xl justify-center hover:scale-110 active:scale-95 group z-50"
      >
        +
      </button>
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
