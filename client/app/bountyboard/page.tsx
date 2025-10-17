"use client"

import { useCallback, useEffect, useState } from "react"
import Overlay from "../components/composite/Overlay"
import client from "../services/fetch-client"
import WantedCard from "../components/composite/reagent/WantedCard"

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

const BountyBoard = () => {
  const [wanted, setWanted] = useState<FirestoreWantedReagent[]>([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [sort, setSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)

  const fetchWantedReagents = useCallback(async() => {
    try {
      const { data } = await client.GET("/wanted" as any, {})
      setWanted((data as FirestoreWantedReagent[]) || [])
    } catch (error) {
      console.error("Failed to fetch wanted reagents:", error)
      setWanted([])
    }
  }, [])

  useEffect(() => {
    fetchWantedReagents()
    try {
      const token = localStorage.getItem("authToken")
      setIsSignedIn(!!token)
    } catch {
      setIsSignedIn(false)
    }
  }, [fetchWantedReagents])

  
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

      {/* search bar
      <div className="bg-transparent pt-[2rem] mx-4 md:gap-[2rem] md:mx-[2rem]">
        <SearchBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          sort={sort}
          setSort={setSort}
        />
      </div> */}

      <div className="mx-4 md:mx-8 mt-8 space-y-4">
        {wanted.length === 0 ? (
          <div className="text-center text-white/60 py-12">
            <p className="text-lg">No wanted reagents found</p>
            <p className="text-sm mt-2">Be the first to post what you're looking for!</p>
          </div>
        ) : (
          wanted.map((reagent) => (
            <WantedCard
              key={reagent.id}
              wanted={reagent}
            />
          ))
        )}
      </div>
        
    </Overlay>
  )
}

export default BountyBoard