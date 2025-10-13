"use client"
import { useEffect, useState, ElementType } from "react"
import { useParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/config/firebase"
// components
import ReagentCard from "../../components/composite/reagent/ReagentCard"
import Overlay from "../../components/composite/Overlay"
import Button from "@/app/components/generic/button/regular/Button"
import OutlinedButton from "../../components/generic/button/outlined/OutlinedButton"
import SearchBar from "../../components/composite/searchbar/SearchBar"
import Pagination from "../../components/composite/pagination/Pagination"
import { ProfileForm } from "../../components/composite/profileform/profileForm"
// services
import useAuthGuard from "@/app/hooks/useAuthGuard"
// other
import { User } from "../../../../server/src/business-layer/models/User"
import { components } from "@/models/__generated__/schema"
import { usePagaination } from "../../hooks/usePagination"
import { usePageSize } from "../../hooks/usePageSize"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }
import {
  HomeIcon,
  Square3Stack3DIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline"
import LoadingState from "@/app/components/composite/loadingstate/LoadingState"

/*
TO DO!!
  1) edit profile functionality
  2) change "expiring soon" filter to use dynamic instead of hard-coded expiry
*/

type reagentCategoryFilter =
  | "all"
  | "on marketplace"
  | "expiring soon"
  | "private"

const UserProfile = () => {
  const params = useParams<{ id: string }>()
  const idOfUserBeingViewed = params.id
  // users
  const [userUid, setUserUid] = useState<string | null>(null)
  const [userBeingViewed, setUserBeingViewed] = useState<User | null>(null)
  // reagents
  const [reagentSearch, setReagentSearch] = useState<string>("")
  const [reagentCategoryFilter, setReagentCategoryFilter] =
    useState<reagentCategoryFilter>("all")
  const [reagentCategoryFilterIndex, setReagentCategoryFilterIndex] =
    useState<number>(0)
  const [reagentSearchFilter, setReagentSearchFilter] = useState("all")
  const [reagentSearchSort, setReagentSearchSort] = useState<
    "newest" | "oldest" | "nameAZ" | "nameZA" | ""
  >("newest")
  const [reagents, setReagents] = useState<ReagentWithId[] | null>(null)

  const { fetchWithAuth } = useAuthGuard({ redirectToAuth: true })
  const [showEditProfile, setShowEditProfile] = useState(false)
  // to be used when mapping reagent filter btns
  const reagentFilters: {
    label: string
    categoryFilterValue: reagentCategoryFilter
    bgColour: string
    icon: ElementType
  }[] = [
    {
      label: "All Reagents",
      categoryFilterValue: "all",
      bgColour: "#7C7EFF",
      icon: Square3Stack3DIcon,
    },
    {
      label: "On Marketplace",
      categoryFilterValue: "on marketplace",
      bgColour: "#44A04A",
      icon: ShoppingCartIcon,
    },
    {
      label: "Expiring Soon",
      categoryFilterValue: "expiring soon",
      bgColour: "#FF666C",
      icon: ExclamationTriangleIcon,
    },
    {
      label: "Private Inventory",
      categoryFilterValue: "private",
      bgColour: "#FF9156",
      icon: LockClosedIcon,
    },
  ]

  // keep reagent filter index in sync with the selected filter
  useEffect(() => {
    const i = reagentFilters.findIndex(
      (filter) => filter.categoryFilterValue === reagentCategoryFilter,
    )
    setReagentCategoryFilterIndex(i)
  }, [reagentCategoryFilter])

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
      const result = await fetchWithAuth<ReagentWithId[]>(
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

    getUserDetails()
    getReagents()
  }, [])

  // MORE TECH DEBT - copied from marketplace page, should modularize this func
  const filtered = reagents?.filter((r) => {
    // first appply category filter (all, on marketplace, expiring soon, private)
    let categoryMatch = true
    switch (reagentCategoryFilter) {
      case "on marketplace":
        categoryMatch = r.visibility !== "private"
        break
      case "expiring soon": {
        // currently hardcoded to 30 days from now, change to dynamic later (using user-set expires soon time)
        const expiryDate = new Date(r.expiryDate)
        const today = new Date()
        const thirtyDaysFromNow = new Date(
          today.getTime() + 30 * 24 * 60 * 60 * 1000,
        )
        categoryMatch = expiryDate <= thirtyDaysFromNow && expiryDate >= today
        break
      }
      case "private":
        categoryMatch = r.visibility === "private"
        break
      default:
        categoryMatch = true
        break
    }

    if (!categoryMatch) return false

    // Then apply search filters (tag, category, date, name)
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
  const sorted = [...(filtered || [])].sort((a, b) => {
    switch (reagentSearchSort) {
      case "newest":
        return b.expiryDate.localeCompare(a.expiryDate)
      case "oldest":
        return a.expiryDate.localeCompare(b.expiryDate)
      case "nameAZ":
        return a.name.localeCompare(b.name)
      case "nameZA":
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })
  // pagination
  const pageSize = usePageSize()
  const { currentPage, setCurrentPage, currentData, totalPages } =
    usePagaination(sorted, pageSize)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    } else if (currentPage < 1) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])
  // return loading state if data hasn't finished loading
  if (!userBeingViewed || !reagents) {
    return (
      <div className="bg-transparent h-[100vh] w-full">
        <div className="bg-transparent w-full items-center gap-4 text-white flex justify-center mt-[50vh]">
          <LoadingState pageName="Profile" />
        </div>
      </div>
    )
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowEditProfile(false)
    }
  }
  const handleProfileFormSubmit = async (updatedUserData: any) => {
    setUserBeingViewed(updatedUserData)
    setShowEditProfile(false)
    console.log("Profile updated successfully!")
  }

  return (
    <Overlay>
      <div className="px-5 pt-5">
        {/* profile header */}
        <div className="flex gap-3">
          <img
            src={userBeingViewed?.image || "/default_pfp.jpg"}
            alt="User Profile Photo"
            className="w-32 h-32 rounded-full border-2 object-cover border-[#6C6C6C] dark:border-white"
            onError={(e) => {
              e.currentTarget.src = "/default_pfp.jpg"
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-6">
              <h1 className="font-light text-pearl text-xl md:text-4xl">
                {idOfUserBeingViewed === userUid
                  ? `Welcome back, ${userBeingViewed && userBeingViewed?.preferredName}`
                  : `${userBeingViewed && userBeingViewed?.displayName}'s Profile`}
              </h1>
              {/* show 'edit profile' btn if user is viewing their own profile */}
              {idOfUserBeingViewed === userUid && (
                <PencilSquareIcon
                  className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:opacity-70 transition-opacity"
                  style={{ color: "#A1A1A1" }}
                  onClick={() => setShowEditProfile(true)}
                />
              )}
            </div>
            <p className="flex items-center gap-2 text-xs md:text-sm text-orange-200 dark:text-blue-primary">
              <HomeIcon className="w-5 h-5 md:w-6 md:h-6" />
              {userBeingViewed.university}
            </p>
            <p className="flex items-center gap-2 text-xs md:text-sm text-blue-primary dark:text-orange-200">
              <EnvelopeIcon className="w-5 h-5 md:w-6 md:h-6" />
              {userBeingViewed.email || "Unknown"}
            </p>
            {/* About Me section */}
            {userBeingViewed.about && (
              <p className="flex items-center gap-2 text-xs md:text-sm dark:text-gray-400 leading-relaxed">
                {userBeingViewed.about}
              </p>
            )}
          </div>
        </div>
        {/* reagent section */}
        <div className="mt-20 flex flex-col gap-8 md:gap-2">
          {/* reagent filter btns */}
          <div className="flex flex-col gap-4 mb-5">
            <div className="flex gap-4 justify-center md:justify-start">
              {reagentFilters.map((btnProps) =>
                reagentCategoryFilter === btnProps.categoryFilterValue ? (
                  <div key={btnProps.categoryFilterValue}>
                    {/* variant for wide-screen views */}
                    <span className="hidden md:block">
                      <Button
                        textSize="text-sm"
                        fontWeight="normal"
                        key={btnProps.categoryFilterValue}
                        label={btnProps.label}
                        backgroundColor={btnProps.bgColour}
                        icon={btnProps.icon}
                        onClick={() =>
                          setReagentCategoryFilter(btnProps.categoryFilterValue)
                        }
                      />
                    </span>
                    {/* variant for mobile-screen views */}
                    <span className="block md:hidden">
                      <button
                        type="button"
                        className="p-2 text-white rounded-lg"
                        onClick={() =>
                          setReagentCategoryFilter(btnProps.categoryFilterValue)
                        }
                        style={{ backgroundColor: btnProps.bgColour }}
                      >
                        <btnProps.icon className={`w-7`} />
                      </button>
                    </span>
                  </div>
                ) : (
                  <div key={btnProps.categoryFilterValue}>
                    <span className="hidden md:block">
                      <OutlinedButton
                        textSize="text-sm"
                        fontWeight="normal"
                        key={btnProps.categoryFilterValue}
                        label={btnProps.label}
                        backgroundColor={btnProps.bgColour}
                        icon={btnProps.icon}
                        onClick={() =>
                          setReagentCategoryFilter(btnProps.categoryFilterValue)
                        }
                      />
                    </span>
                    <span className="block md:hidden">
                      <button
                        type="button"
                        className="bg-gray-50 dark:bg-primary p-2 rounded-lg outline-2"
                        onClick={() =>
                          setReagentCategoryFilter(btnProps.categoryFilterValue)
                        }
                        style={{
                          outlineColor: btnProps.bgColour,
                          color: btnProps.bgColour,
                        }}
                      >
                        <btnProps.icon className={`w-7`} />
                      </button>
                    </span>
                  </div>
                ),
              )}
            </div>
            <h5
              className="text-center font-light text-sm italic  md:hidden"
              style={{
                color: reagentFilters[reagentCategoryFilterIndex].bgColour,
              }}
            >
              {`Viewing '${reagentFilters[reagentCategoryFilterIndex].label}'`}
            </h5>
          </div>
          {/* reagent search bar + results */}
          <div className="flex flex-col gap-2">
            <h4 className="font-light text-lg md:text-xl text-tint">
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
            {/* if raw reagent array AND sorted array are both length 0, it means user has no reagents */}
            {currentData.length === 0 ? (
              <p className="flex justify-center mt-8 italic text-gray-100 dark:text-light-gray">
                {reagents.length === 0
                  ? "This user has no reagents"
                  : "No reagents under selected filters and/or search query"}
              </p>
            ) : (
              <div className="bg-transparent flex flex-wrap gap-4 md:gap-[2rem] md:mx-[2rem] pb-[4rem]">
                {currentData.map((r) => (
                  <ReagentCard key={r.id} reagent={r as ReagentWithId} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="pb-[4rem] md:pb-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      {showEditProfile && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 "
          onClick={handleBackdropClick}
        >
          <div className="bg-primary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl ">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-medium text-white">Edit</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 text-3xl hover:text-white "
              >
                ❌
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <ProfileForm
                onSubmit={handleProfileFormSubmit}
                onCancel={() => setShowEditProfile(false)}
                userId={idOfUserBeingViewed}
              />
            </div>
          </div>
        </div>
      )}
    </Overlay>
  )
}

export default UserProfile
