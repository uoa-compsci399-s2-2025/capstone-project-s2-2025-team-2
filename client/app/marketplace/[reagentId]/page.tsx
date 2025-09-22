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
import SellerContactMobile from "@/app/components/composite/reagentview/SellerContactMobile"

interface ReagentViewProps {
  params: Promise<{ reagentId: string }>
}

export default function ReagentView({ params }: ReagentViewProps) {
  const { reagentId } = use(params)

  const [reagent, setReagent] = useState<Reagent | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [reagentId])

  useEffect(() => {
    const fetchReagents = async () => {
      const { data } = await client.GET(`/reagents/${reagentId}` as any, {})
      setReagent(data)
    }
    fetchReagents()
  }, [])

  if (!reagent)
    return (
      <div className="bg-primary h-[100vh] w-full">
        <div className="bg-primary w-full items-center gap-4 text-white flex justify-center mt-[50vh]">
          <svg
            fill="white"
            viewBox="0 0 24 24"
            width={50}
            height={50}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity=".25"
            />
            <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="0.75s"
                values="0 12 12;360 12 12"
                repeatCount="indefinite"
              />
            </path>
          </svg>
          <h3>Loading...</h3>
        </div>
      </div>
    )
  return (
    <div
      className="
    font-family-sans h-full w-full min-h-screen md:flex md:items-center md:justify-center
    background-gradient md:p-[2rem] md:-mt-[2rem] mb-[6rem] md:mb-0
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
          <div className="bg-primary -mt-[1.3rem] mb-[1rem] relative z-10 rounded-t-3xl lg:mt-0 md:mb-0 md:rounded-none md:z-auto md:bg-transparent">
            <div className="pt-[2rem] lg:pt-0 px-[2rem] md:px-0">
              <ReagentBreadcrumb reagentName={reagent.name ?? ""} />
            </div>

            <div className="flex flex-col items-start">
              <h1 className="hidden md:block ml-0 mt-[1rem] mb-[1rem] text-white tracking-wider">
                {reagent.name}
              </h1>
              <h2 className="md:hidden ml-[2rem] mr-[2rem] mt-[1.5rem] text-white tracking-wider">
                <b>{reagent.name}</b>
              </h2>
              <div className="md:hidden px-[2rem] mt-[1.5rem]">
                <h5 className="text-white/80 mb-[0.5rem]">
                  Quantity: {reagent.quantity}
                </h5>
                <p className="text-white mb-[1rem]">{reagent.description}</p>
              </div>

              <div className="px-[2rem] mb-[2rem] md:mb-0 md:px-0 lg:mt-0 gap-[1rem] lg:gap-12 flex flex-col lg:flex-row justify-start md:w-full mt-[1rem]">
                {" "}
                <h5 className="flex text-blue-secondary items-center text-[0.8rem]">
                  <FaRegClock className="text-blue-secondary mr-[0.3rem] w-5 h-5" />{" "}
                  Listed - {reagent.expiryDate}
                </h5>
                <h5 className="flex text-red-500 items-center text-[0.8rem]">
                  <LuClockAlert className="text-red-500 mr-[0.3rem] w-5 h-5" />
                  Expires - {reagent.expiryDate}
                </h5>
                <h5 className="flex text-blue-secondary items-center text-[0.8rem]">
                  <LuHouse className="text-blue-secondary mr-[0.3rem] w-5 h-5" />{" "}
                  Location -{reagent.location}
                </h5>
                <div className="md:hidden mt-[1rem] flex">
                  {reagent.categories?.map((tag) => {
                    return (
                      <div
                        className="px-2 py-1 mr-[1rem] text-xs rounded-lg tracking-widest text-white bg-secondary/30"
                        key={tag}
                      >
                        {tag}
                      </div>
                    )
                  })}
                </div>
                <div className="md:hidden mt-[1rem] ">
                  <div className="w-[60vw] max-w-2xl my-[1rem] border-t border-light-gray" />

                  <h4 className="text-white tracking-wider mb-[0.3rem]">
                    <b>Seller Details</b>
                  </h4>
                  <SellerContactMobile />
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
                  <div className="bg-blue-primary/75 text-center py-[1rem]">
                    <h4 className="text-white">Current price</h4>
                    <h2 className="text-white">${reagent.price}</h2>
                  </div>
                  <div className="flex flex-col bg-primary p-[2rem]">
                    <div className="mb-[1rem]">
                      <h5 className="text-white/80">
                        Quantity: {reagent.quantity}
                      </h5>
                    </div>
                    <div className="">
                      <p className="text-white">{reagent.description}</p>
                      <div className="mt-[2rem] flex">
                        {reagent.categories?.map((tag) => {
                          return (
                            <div
                              className="px-2 py-1 mx-2 text-xs rounded-lg tracking-widest text-white bg-secondary/30"
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

        <div className="fixed bottom-0 w-full md:hidden bg-background -mt-[2rem] z-10 rounded-t-3xl">
          <div className="flex h-[8rem] justify-between">
            <span className="flex flex-col justify-center ml-[2rem]">
              <p className="text-white/60 text-[1.1rem]">Price</p>
              <h2 className="text-green-500">${reagent.price}</h2>
            </span>
            <div className="flex items-center mr-[2rem]">
              <SellerContact
                reagent={
                  reagent
                    ? {
                        ...reagent,
                        id: reagentId,
                        createdAt:
                          reagent.createdAt instanceof Date
                            ? reagent.createdAt.toISOString()
                            : reagent.createdAt,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        <div className="hidden md:block mt-[2rem]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-[80vw] max-w-2xl min-w-xl mx-auto my-[1rem] border-t border-light-gray" />
            <div className="max-w-2xl mx-auto grid grid-cols-4 mb-[0.1rem]">
              <h4 className="text-left text-white tracking-wider col-span-1">
                <b>Seller Details</b>
              </h4>
            </div>
            <SellerContact
              reagent={
                reagent
                  ? {
                      ...reagent,
                      id: reagentId,
                      createdAt:
                        reagent.createdAt instanceof Date
                          ? reagent.createdAt.toISOString()
                          : reagent.createdAt,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
