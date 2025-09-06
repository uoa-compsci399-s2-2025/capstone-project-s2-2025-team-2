"use client"
import { useEffect, useState } from "react"
import Overlay from "../components/composite/sidebar/Overlay"
import SearchBar from "../components/composite/searchbar/SearchBar"
import ReagentCard from "../components/composite/marketplace/ReagentCard"
import { Reagent } from "../../../server/src/data-layer/models/Reagent"

const Marketplace = () => {
  const [reagents, setReagents] = useState<Reagent[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState<"newest" | "oldest" | "name" | "">("newest")

  useEffect(() => {
    const fetchReagents = async () => {
      const res = await fetch("http://localhost:8000/api/getAllReagents")
      const data: Reagent[] = await res.json()
      console.log("Fetched reagents:", data)
      setReagents(data)
    }
    fetchReagents()
  }, [])

  const filtered = reagents.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))

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
      <SearchBar
        search={search}
        setSearch={setSearch}
        filter={filter}
        setFilter={setFilter}
        sort={sort}
        setSort={setSort}
      />
      <div className="bg-white dark:bg-black flex flex-wrap pt-[2rem] gap-[2rem] mx-[2rem]">
        {sorted.map(r => (
          <ReagentCard
            key={r.id}
            name={r.name}
            description={r.description}
            tags={Array.isArray(r.categories) ? r.categories : []}
            location={r.location ?? "Unknown"}
            expiryDate={r.expiryDate ?? "N/A"}
            imageUrl={r.images?.[0] ?? "/placeholder.png"}
            quantity={r.price?.toString() ?? "N/A"}
            formula={r.tradingType ?? ""}
          />
        ))}
      </div>
    </Overlay>
  )
}

export default Marketplace
