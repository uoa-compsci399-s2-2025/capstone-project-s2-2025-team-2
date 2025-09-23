"use client"
import { useEffect, useState, use } from "react"
import client from "@/app/services/fetch-client"
import { Reagent } from "../../../../server/src/business-layer/models/Reagent"
import { FaRegClock } from "react-icons/fa"
import { LuClockAlert } from "react-icons/lu"
import { LuHouse } from "react-icons/lu"
import Image from "next/image"
import SellerContact from "@/app/components/composite/reagentview/SellerContact"
import ReagentBreadcrumb from "@/app/components/composite/reagentview/ReagentBreadcrumb"

import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/config/firebase"
import { User } from "../../../../server/src/business-layer/models/User"

interface ReagentViewProps {
  params: Promise<{ reagentId: string }>
}

export default function ReagentView({ params }: ReagentViewProps) {
  const { reagentId } = use(params)

  const [reagent, setReagent] = useState<Reagent | null>(null)
  const [UID, setUID] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // get page viewer's id: WORKS
  useEffect(() => {
    if (!auth) return
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUID(user?.uid ?? null)
    })
    console.log("User id: ", UID)
    return () => unsubscribe()
  }, [UID])
  ///====================
  useEffect(() => {
  if (!UID) return

  const fetchUser = async () => {
    try {
      const { data } = await client.GET(`/users/${UID}` as any, {})
      if (!data) {
        console.error("User data not found")
        setCurrentUser(null)
        return
      }
      setCurrentUser(data)
      console.log("User role:", data.role)
    } catch (err) {
      console.error("Failed to fetch current user:", err)
      setCurrentUser(null)
    }
  }

  fetchUser()
}, [UID])

  //fetch user
  
  //======================================

  useEffect(() => {
    const fetchReagents = async () => {
      const { data } = await client.GET(`/reagents/${reagentId}` as any, {})
      setReagent(data)
    }
    fetchReagents()
  }, [])

  if (!reagent)
    return (
      <div className="bg-black h-[100vh] text-white flex justify-center mt-[50vh]">
        Loading...
      </div>
    )
  return (
    <div
      className="
    font-family-sans h-full w-full min-h-screen md:flex md:items-center md:justify-center
    md:background-gradient md:p-[2rem] md:-mt-[2rem] mb-[5rem] md:mb-0
    "
    >
      <div className="md:max-w-6xl mx-auto w-full">
        <div className="md:max-w-6xl mx-auto">
          <div className="md:hidden relative overflow-hidden h-[25rem] md:h-[15rem] md:mb-[1rem]">
            <Image
              src="/placeholder.webp"
              alt="Reagent"
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-primary -mt-[1.3rem] mb-[1rem] relative z-10 rounded-t-3xl md:mt-0 md:mb-0 md:rounded-none md:z-auto md:bg-transparent">
            <div className="pt-[2rem] md:pt-0 px-[2rem] md:px-0">
              <ReagentBreadcrumb reagentName={reagent.name ?? ""} />
            </div>

            <div className="flex flex-col items-start">
              <h1 className="hidden md:block ml-0 mt-[1rem] mb-[1rem] text-white tracking-wider">
                {reagent.name}
              </h1>
              <h2 className="md:hidden ml-[2rem] mt-[1.5rem] text-white tracking-wider">
                <b>{reagent.name}</b>
              </h2>
              <div className="md:hidden px-[2rem] mt-[1rem]">
                <p className=" text-white mb-1">
                  <b>Quantity: </b> {reagent.quantity}
                </p>
                <p className="text-white">{reagent.description}</p>
              </div>

              <div className="px-[2rem] mt-[2rem] mb-[2rem] md:mb-0 md:px-0 md:mt-0 gap-[1rem] md:gap-12 flex flex-col md:flex-row justify-around md:w-[47rem] mt-[1rem]">
                <h5 className="flex text-green-200 items-center text-[0.8rem]">
                  <FaRegClock className="text-green-200 mr-[0.3rem] w-5 h-5" />{" "}
                  Listed - {reagent.expiryDate}
                </h5>
                <h5 className="flex text-red-300 items-center text-[0.8rem]">
                  <LuClockAlert className="text-red-300 mr-[0.3rem] w-5 h-5" />
                  Expires - {reagent.expiryDate}
                </h5>
                <h5 className="flex text-blue-300 items-center text-[0.8rem]">
                  <LuHouse className="text-blue-300 mr-[0.3rem] w-5 h-5" />{" "}
                  Location -{reagent.location}
                </h5>
                <div className="md:hidden mt-[1rem] flex">
                  {reagent.categories?.map((tag) => {
                    return (
                      <div
                        className="py-1 mr-[0.8rem] px-[0.8rem] rounded-[0.7rem] tracking-widest text-white bg-secondary/60"
                        key={tag}
                      >
                        {tag}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="flex mt-[3rem] justify-center mx-auto">
              <div className="md:flex-[1.3] relative">
                <Image
                  src="/placeholder.webp"
                  alt="Reagent"
                  fill
                  className="object-cover rounded-l-[8px]"
                />
              </div>
              <div className="hidden md:block flex-[1.3] ml-[1rem] ">
                <div className="rounded-r-[8px] overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                  <div className="bg-green-600/40 text-center py-[1rem]">
                    <h4 className="text-green-500 font-bold">Current price</h4>
                    <h2 className="text-green-500">${reagent.price}</h2>
                  </div>
                  <div className="flex flex-col bg-primary p-[2rem]">
                    <div className="mb-[1rem]">
                      <p className="text-white">
                        <b>Quantity: </b>
                        {reagent.quantity}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-white">{reagent.description}</p>
                      <div className="mt-[2rem] flex">
                        {reagent.categories?.map((tag) => {
                          return (
                            <div
                              className="px-4 py-2 mx-[0.4rem] px-[0.8rem] rounded-[0.7rem] tracking-widest text-white bg-background"
                              key={tag}
                            >
                              {tag}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fixed bottom-0 w-full md:hidden bg-background z-50 rounded-t-3xl">
              <div className="flex h-[8rem] justify-between">
                <span className="flex flex-col justify-center ml-[2rem]">
                  <p className="text-white/60 text-[1.3rem]">Price</p>
                  <h2 className="text-green-500">${reagent.price}</h2>
                </span>
                <div className="flex items-center mr-[2rem]">
                  <SellerContact />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block mt-[3rem]">
          <div className="w-[60vw] mx-auto my-[2rem] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
          <div className="flex flex-col items-center gap-5">
            <SellerContact userRole={currentUser?.role === "admin"} />
          </div>
        </div>
      </div>
    </div>
  )
}
