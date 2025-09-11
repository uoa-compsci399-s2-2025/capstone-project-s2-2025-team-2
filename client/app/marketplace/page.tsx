"use client"
import { useEffect, useState } from "react"
import Overlay from "../components/composite/Overlay"
import SearchBar from "../components/composite/searchbar/SearchBar"
import ReagentCard from "../components/composite/reagent/ReagentCard"
import { Reagent } from "../../../server/src/data-layer/models/Reagent"
import client from "../services/fetch-client"

const Marketplace = () => {
  const [reagents, setReagents] = useState<Reagent[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState<"newest" | "oldest" | "name" | "">("newest")

  useEffect(() => {
    const fetchReagents = async () => {
      const { data } = await client.GET(
        "/reagents" as any, {}
      )
      console.log(data)
      setReagents(data)
    }
    fetchReagents()
  }, [])

  const filtered = reagents.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "newest":
        return a.expiryDate.localeCompare(b.expiryDate)
      case "oldest":
        return b.expiryDate.localeCompare(a.expiryDate)
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <Overlay>
      <p className="text-4xl text-white mt-8 ml-8 tracking-[0.1em]">
        Marketplace
      </p>
      <p className="ml-8 text-warning italic font-bold inline mr-2 tracking-[0.05em]">
        Buy, Sell & Exchange
      </p>
      <p className="text-gray-100 italic inline">Laboratory Reagents</p>

      <div className="mt-5">
        <SearchBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div className="bg-background dark:bg-black flex flex-wrap pt-[2rem] gap-[2rem] mx-[2rem]">
        {sorted.map((r) => (
          <ReagentCard
            key={r.id}
            name={r.name}
            description={r.description}
            tags={Array.isArray(r.categories) ? r.categories : []}
            location={r.location ?? "Unknown"}
            expiryDate={r.expiryDate ?? "N/A"}
            imageUrl={r.images?.[0] ?? "/placeholder.png"}
            formula={r.tradingType ?? ""}
          />
        ))}
      </div>
    </Overlay>
  )
}

export default Marketplace
