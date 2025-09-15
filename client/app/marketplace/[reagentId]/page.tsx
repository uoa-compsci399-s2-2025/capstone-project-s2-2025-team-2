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

interface ReagentViewProps {
  params: Promise<{ reagentId: string }>
}

export default function ReagentView({ params }: ReagentViewProps) {
  const { reagentId } = use(params)

  const [reagent, setReagent] = useState<Reagent | null>(null)

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
    md:background-gradient md:p-[2rem] md:-mt-[2rem]
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
          <div className="bg-primary -mt-[1rem] mb-[1rem] relative z-10 rounded-t-3xl md:mt-0 md:mb-0 md:rounded-none md:z-auto md:bg-transparent">
            <div className="pt-[2rem] md:pt-0 px-[2rem] md:px-0">
              <ReagentBreadcrumb reagentName={reagent.name ?? ""} />
            </div>

            <div className="flex flex-col items-start">
              <h1 className="ml-[2rem] mt-[1rem] md:ml-0 md:mt-[1rem] md:mb-[1rem] text-white tracking-wider">
                {reagent.name}
              </h1>

              <div className="md:hidden px-[2rem] mt-[1rem]">
                <p className=" text-white mb-1">
                  <b>Quantity: </b> {reagent.quantity}
                </p>
                <p className="text-white">{reagent.description}</p>
              </div>

              <div className="px-[1.5rem] mt-[2rem] mb-[2rem] md:mb-0 md:px-0 md:mt-0 gap-12 flex flex-col md:flex-row justify-around w-[47rem] mt-[1rem]">
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
                        className="mr-[0.8rem] px-[0.8rem] rounded-[0.7rem] font-family-sans tracking-widest text-white bg-secondary"
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
                              className="px-4 py-2 mx-[0.4rem] px-[0.8rem] rounded-[0.7rem] font-family-sans tracking-widest text-white bg-background"
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
          </div>
        </div>

        <div className="md:hidden bg-background -mt-[2rem] relative z-10 rounded-t-3xl md:mt-0 md:rounded-none md:z-auto md:bg-transparent">
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

        <div className="hidden md:block mt-[3rem]">
          <div className="w-[60vw] mx-auto my-[2rem] h-[1px] bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
          <div className="flex flex-col items-center gap-5">
            <SellerContact />
          </div>
        </div>
      </div>
    </div>
  )
}
