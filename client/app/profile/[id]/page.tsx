"use client"
import { useEffect, useState, ElementType } from "react"
import { useParams } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/config/firebase"
import client from "../../services/fetch-client"
// components
import ReagentCard from "../../components/composite/reagent/ReagentCard"
import Overlay from "../../components/composite/Overlay"
import SearchBar from "../../components/composite/searchbar/SearchBar"
import Pagination from "../../components/composite/pagination/Pagination"
import { ProfileForm } from "../../components/composite/profileform/profileForm"
import { ReagentForm } from "../../components/composite/reagent/ReagentForm"
// services
import useAuthGuard from "@/app/hooks/useAuthGuard"
// other
import { User } from "../../../../server/src/business-layer/models/User"
import { components } from "@/models/__generated__/schema"
import { usePagination } from "../../hooks/usePagination"
import { usePageSize } from "../../hooks/usePageSize"

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }
import {
  MapPinIcon,
  PencilSquareIcon,
  Square3Stack3DIcon,
  ShoppingCartIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  XMarkIcon,
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
  | "expired"

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
  const [reagentSearchFilter, setReagentSearchFilter] = useState("all")
  const [reagentSearchSort, setReagentSearchSort] = useState<
    "earliestExpiry" | "latestExpiry" | "nameAZ" | "nameZA" | ""
  >("earliestExpiry")
  const [reagents, setReagents] = useState<ReagentWithId[] | null>(null)

  const { fetchWithAuth } = useAuthGuard({ redirectToAuth: true })
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showEditReagentForm, setShowEditReagentForm] = useState(false)
  const [selectedReagent, setSelectedReagent] = useState<ReagentWithId | null>(
    null,
  )
  // to be used when mapping reagent filter btns
  const reagentFilters: {
    label: string
    categoryFilterValue: reagentCategoryFilter
    icon: ElementType
    isProfileOwner?: boolean
  }[] = [
    {
      label: "All Reagents",
      categoryFilterValue: "all",
      icon: Square3Stack3DIcon,
      isProfileOwner: userUid === idOfUserBeingViewed,
    },
    {
      label: "On Marketplace",
      categoryFilterValue: "on marketplace",
      icon: ShoppingCartIcon,
    },
    {
      label: "Expiring Soon",
      categoryFilterValue: "expiring soon",
      icon: ExclamationTriangleIcon,
            isProfileOwner: userUid === idOfUserBeingViewed,

    },
    {
      label: "Private Inventory",
      categoryFilterValue: "private",
      icon: LockClosedIcon,
      isProfileOwner: userUid === idOfUserBeingViewed,
    },
    {
      label: "Expired Reagents",
      categoryFilterValue: "expired",
      icon: XMarkIcon,
      isProfileOwner: userUid === idOfUserBeingViewed,
    },
  ]
    //filter out links when user is viewing another persons profile
  const visibleFilters = reagentFilters.filter((filter) => {
    if (filter.isProfileOwner === undefined) return true
    return filter.isProfileOwner
  })

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
      case "expired": {
        const expiryDate = new Date(r.expiryDate)
        const today = new Date()
        categoryMatch =
          expiryDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0)
        break
      }
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
      case "earliestExpiry":
        return b.expiryDate.localeCompare(a.expiryDate)
      case "latestExpiry":
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
    usePagination(sorted, pageSize)
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

  const handleEditReagentClick = (reagent: ReagentWithId) => {
    setSelectedReagent(reagent)
    setShowEditReagentForm(true)
  }

  const handleEditReagentFormSubmit = async () => {
    await getReagents() // prob not ideal but i couldnt make the reagent update (without user refreshing page) w/ any other method
    setShowEditReagentForm(false)
    setSelectedReagent(null)
  }

  const handleReagentFormCancel = () => {
    setShowEditReagentForm(false)
    setSelectedReagent(null)
  }

  const handleDeleteReagent = async (reagentId: string) => {
    try {
      const idToken = localStorage.getItem("authToken")
      if (!idToken) return

      const { error } = await client.DELETE(
        `/users/reagents/${reagentId}` as any,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      if (error) {
        throw new Error(`Failed to delete reagent: ${error}`)
      }

      await getReagents()
      setShowEditReagentForm(false)
      setSelectedReagent(null)
    } catch (err) {
      console.error(`Error deleting reagent: ${err}`)
      throw new Error(`Failed to delete reagent: ${err}`)
    }
  }

  return (
    <Overlay>
      <div className="px-5 pt-5">
        {/* profile header */}
        <div className="flex flex-col items-center gap-6 max-w-[80rem] mx-auto w-full mt-8">
          <div className="flex items-center gap-6">
            <img
              src={userBeingViewed?.image || "/default_pfp.jpg"}
              alt="User Profile Photo"
              className="w-32 h-32 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default_pfp.jpg"
              }}
            />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <h1 className="font-light text-white text-2xl md:text-3xl">
                  {userBeingViewed?.displayName ||
                    userBeingViewed?.preferredName}
                </h1>
                {/* show 'edit profile' btn if user is viewing their own profile */}
                {idOfUserBeingViewed === userUid && (
                  <PencilSquareIcon
                    className="w-5 h-5 cursor-pointer hover:opacity-70 transition-opacity text-gray-100"
                    onClick={() => setShowEditProfile(true)}
                  />
                )}
              </div>
              <p className="text-sm text-white">{userBeingViewed.university}</p>
              <p className="flex items-center gap-1 text-xs text-gray-100">
                <MapPinIcon className="w-5 h-5" />
                Auckland, New Zealand
              </p>
              {/* About Me section */}
              {userBeingViewed.about && (
                <p className="text-sm text-white leading-relaxed max-w-md">
                  {userBeingViewed.about}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* reagent section */}
        <div className="mt-12 flex flex-col gap-8 md:gap-2 md:mr-20 md:ml-20">
          <div className="flex flex-col gap-6 max-w-[80rem] mx-auto w-full">
            {/*inventory tabs*/}
            <div className="flex flex-col gap-4">
              <div className="flex justify-center gap-8 border-b-2 border-secondary/20">
                {visibleFilters.map((btnProps) => {
                  const isSelected =
                    reagentCategoryFilter === btnProps.categoryFilterValue
                  return (
                    <div
                      key={btnProps.categoryFilterValue}
                      className="relative"
                    >
                      {/*desktop view*/}
                      <span className="hidden md:block">
                        <button
                          type="button"
                          className={`px-4 py-3 text-sm transition-colors duration-200 ${
                            isSelected
                              ? "text-white font-semibold"
                              : "text-gray-100 hover:text-white"
                          }`}
                          onClick={() =>
                            setReagentCategoryFilter(
                              btnProps.categoryFilterValue,
                            )
                          }
                          disabled={userUid !== idOfUserBeingViewed }
                        >
                          {btnProps.label}
                        </button>
                      </span>

                      {/*mobile view*/}
                      <span className="block md:hidden">
                        <button
                          type="button"
                          className={`flex items-center justify-center p-3 text-sm transition-colors duration-200 ${
                            isSelected
                              ? "text-white font-semibold"
                              : "text-gray-100 hover:text-white"
                          }`}
                          onClick={() =>
                            setReagentCategoryFilter(
                              btnProps.categoryFilterValue,
                            )
                          }
                        >
                          <btnProps.icon className="w-5 h-5" />
                        </button>
                      </span>

                      {/*active tab underline*/}
                      {isSelected && (
                        <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-white" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
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
              <div className="bg-transparent flex flex-wrap justify-center gap-3 md:gap-7 pb-[4rem]">
                {currentData.map((r) => (
                  <ReagentCard
                    key={r.id}
                    reagent={r as ReagentWithId}
                    onEditClick={() =>
                      handleEditReagentClick(r as ReagentWithId)
                    }
                    showEditButton={idOfUserBeingViewed === userUid}
                  />
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

      {/* profile EDIT form */}
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
                className="text-white hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              <ProfileForm
                onSubmit={handleProfileFormSubmit}
                onCancel={() => setShowEditProfile(false)}
                userId={idOfUserBeingViewed}
              />
            </div>
          </div>
        </div>
      )}

      {/* reagent card EDIT REAGENT form */}
      {showEditReagentForm && selectedReagent && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleReagentFormCancel()
            }
          }}
        >
          <div className="bg-primary rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-medium text-white">Edit Reagent</h2>
              <button
                onClick={handleReagentFormCancel}
                className="text-white hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
              <ReagentForm
                onSubmit={handleEditReagentFormSubmit}
                onCancel={handleReagentFormCancel}
                editMode={true}
                reagentData={selectedReagent}
                onDelete={handleDeleteReagent}
              />
            </div>
          </div>
        </div>
      )}
    </Overlay>
  )
}

export default UserProfile
