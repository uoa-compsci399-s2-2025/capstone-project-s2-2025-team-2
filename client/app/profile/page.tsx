"use client"
// packages
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
// components
import ReagentCard from "../components/composite/reagent/ReagentCard"
import { DefaultReagentCard } from "../components/composite/reagent/ReagentCard.story"
import Overlay from "../components/composite/Overlay"
import OutlinedButton from "../components/generic/button/outlined/OutlinedButton"
import SearchBar from "../components/composite/searchbar/SearchBar"
// services
import client from "../services/fetch-client"
// other
import { Reagent } from "../../../server/src/business-layer/models/Reagent"
import { HomeIcon } from "@heroicons/react/24/outline"
import { PencilIcon } from "@heroicons/react/24/outline"
import { error } from "console"

// interface needed for auth + content to render

const UserProfile = () => {
  const [reagentSearch, setReagentSearch] = useState<string>("")
  const [reagentCategoryFilter, setReagentCategoryFilter] = useState<
    "all" | "on marketplace" | "expiring soon" | "private"
  >("all")
  const [reagentSearchFilter, setReagentSearchFilter] = useState("all")
  const [reagentSearchSort, setReagentSearchSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [reagents, setReagents] = useState<Reagent[]>([])

  // REMINDER - move data fetching to its own hook later - logan calls dibs on this :)
  useEffect(() => {
    const getReagents = async () => {
      try {
        const authToken = localStorage.getItem("authToken")
        console.log(authToken)
        if (!authToken) return

        const { data, error } = await client.GET("/users/reagents" as any, {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (data && !error) {
          setReagents(data)
        }
      } catch (e) {
        console.error("Failed to fetch user reagents", e)
      }
    }

    getReagents()
  }, [])

  // copied from marketplace page -- should move this func to its own hook?
  const filtered = reagents.filter((r) => {
    const query = reagentSearch.trim().toLowerCase()
    if (!query) return true

    switch (reagentSearchFilter) {
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

  // same w this
  const sorted = [...filtered].sort((a, b) => {
    switch (reagentSearchSort) {
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
      <div className="px-5">
        {/* profile header */}
        <div className="flex gap-3">
          <img
            src="/placeholder.webp"
            alt="User Profile Photo"
            className="w-25 h-25 rounded-full border-3 border-[#6C6C6C] dark:border-white"
          />
          <div className="">
            <h1 className="font-light">Welcome back, NAME</h1>
            <p className="flex items-center gap-2 text-orange-200">
              <HomeIcon className="w-6 h-6" /> University of Auckland
            </p>
            <OutlinedButton
              label="Edit Profile"
              textSize="text-sm"
              className="mt-6"
            />
          </div>
        </div>
        {/* reagent section */}
        <div className="mt-20">
          <h4 className="font-light text-tint">Your Listings</h4>
          <SearchBar
            search={reagentSearch}
            setSearch={setReagentSearch}
            filter={reagentSearchFilter}
            setFilter={setReagentSearchFilter}
            sort={reagentSearchSort}
            setSort={setReagentSearchSort}
          />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {reagents.map((r) => (
              <ReagentCard
                key={`${r.user_id}-${r.name}-${r.expiryDate}`}
                name={r.name}
                description={r.description}
                tags={r.categories}
                location={r.location}
                expiryDate={r.expiryDate}
                imageUrl={r.images?.[0] || ""}
                formula={undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default UserProfile
