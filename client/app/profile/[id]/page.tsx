"use client"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/config/firebase"
// components
import ReagentCard from "../../components/composite/reagent/ReagentCard"
import Overlay from "../../components/composite/Overlay"
import OutlinedButton from "../../components/generic/button/outlined/OutlinedButton"
import SearchBar from "../../components/composite/searchbar/SearchBar"
// services
import useAuthGuard from "@/app/hooks/useAuthGuard"
// other
import { User } from "../../../../server/src/business-layer/models/User"
import { Reagent } from "../../../../server/src/business-layer/models/Reagent"
import { HomeIcon } from "@heroicons/react/24/outline"

const UserProfile = () => {
  const params = useParams<{ id: string }>()
  const idOfUserBeingViewed = params.id
  // user state
  const [userUid, setUserUid] = useState<string | null>(null)
  const [userBeingViewed, setUserBeingViewed] = useState<User | null>(null)
  // reagent state
  const [reagentSearch, setReagentSearch] = useState<string>("")
  const [reagentCategoryFilter, setReagentCategoryFilter] = useState<
    "all" | "on marketplace" | "expiring soon" | "private"
  >("all")
  const [reagentSearchFilter, setReagentSearchFilter] = useState("all")
  const [reagentSearchSort, setReagentSearchSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [reagents, setReagents] = useState<Reagent[]>([])

  const { fetchWithAuth } = useAuthGuard()

  // get users uid
  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserUid(user?.uid ?? null)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const getUserDetails = async () => {
      const result = await fetchWithAuth<User>(
        `/users/${idOfUserBeingViewed}`,
        { protectedEndpoint: true },
      )

      if (result) {
        const { data, error } = result
        if (data && !error) {
          setUserBeingViewed(result.data)
        } else if (error) {
          console.error(`Failed to fetch user reagents: ${error}`)
        }
      }
    }

    const getReagents = async () => {
      const result = await fetchWithAuth<Reagent[]>(
        `/users/${idOfUserBeingViewed}/reagents`,
        { protectedEndpoint: true },
      )

      if (result) {
        const { data, error } = result
        if (data && !error) {
          setReagents(result.data)
        } else if (error) {
          console.error(`Failed to fetch user reagents: ${error}`)
        }
      }
    }

    console.log(userBeingViewed)
    console.log(reagents)

    getUserDetails()
    getReagents()
  }, [])

  // MORE TECH DEBT - copied from marketplace page, should modularize this func
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
          <div className="flex flex-col gap-2">
            <h1 className="font-light">
              {idOfUserBeingViewed === userUid
                ? `Welcome back, ${userBeingViewed && userBeingViewed?.displayName}`
                : `${userBeingViewed && userBeingViewed?.displayName}'s Profile`}
            </h1>
            <p className="flex items-center gap-2 text-[#FF7309] dark:text-orange-200">
              <HomeIcon className="w-6 h-6" /> HOME_INSTITUTION
            </p>
            {/* show 'edit profile' btn if user is viewing their own profile */}
            {idOfUserBeingViewed === userUid && (
              <OutlinedButton
                backgroundColor="#BABABA"
                label="Edit Profile"
                textSize="text-xs"
                className="mt-3 self-start"
              />
            )}
          </div>
        </div>
        {/* reagent section */}
        <div className="mt-20">
          <h4 className="font-light text-midnight dark:text-tint">
            {idOfUserBeingViewed === userUid
              ? "Your Reagents"
              : `${userBeingViewed?.displayName}'s Reagents`}
          </h4>
          <p className="text-dark-gray dark:text-light-gray"></p>
          <SearchBar
            search={reagentSearch}
            setSearch={setReagentSearch}
            filter={reagentSearchFilter}
            setFilter={setReagentSearchFilter}
            sort={reagentSearchSort}
            setSort={setReagentSearchSort}
          />
          <div className="bg-transparent flex flex-wrap pt-[2rem] gap-4 mx-4 md:gap-[2rem] md:mx-[2rem] pb-[4rem]">
            {sorted.map((reagent: Reagent) => (
              <ReagentCard
                key={uuidv4()}
                name={reagent.name}
                description={reagent.description}
                tags={reagent.categories || []}
                location={reagent.location || "Unknown"}
                expiryDate={reagent.expiryDate || "N/A"}
                imageUrl={
                  reagent.images?.[0] !== "string"
                    ? reagent.images?.[0] || "/placeholder.webp"
                    : "/placeholder.webp"
                }
                formula={reagent.tradingType || ""}
              />
            ))}
          </div>
        </div>
      </div>
    </Overlay>
  )
}

export default UserProfile
