"use client"
import { useEffect, useState, use } from "react"
import client from "@/app/services/fetch-client"
import { Reagent } from "../../../../server/src/business-layer/models/Reagent"
import { FaRegClock } from "react-icons/fa"
import { LuClockAlert } from "react-icons/lu"
import { LuHouse } from "react-icons/lu"
import Image from "next/image"
import SellerContact from "@/app/components/composite/reagentview/SellerContact"
import ImageCarousel from "@/app/components/generic/image_carousel/ImageCarousel"
import Overlay from "@/app/components/composite/Overlay"
import LoadingState from "@/app/components/composite/loadingstate/LoadingState"

interface ReagentViewProps {
  params: Promise<{ reagentId: string }>
}

export default function ReagentView({ params }: ReagentViewProps) {
  const { reagentId } = use(params)
  const [sellerInfo, setSellerInfo] = useState<any>(null)
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

  //fetch seller info using user id
  useEffect(() => {
    if (!reagent?.user_id) return

    const fetchSellerInfo = async () => {
      try {
        const { data } = await client.GET(
          `/users/${reagent.user_id}` as any,
          {},
        )
        if (data) {
          setSellerInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch seller information:", error)
      }
    }

    fetchSellerInfo()
  }, [reagent?.user_id])
  // loading state
  if (!reagent || !sellerInfo)
    return (
      <div className="bg-transparent h-[100vh] w-full">
        <div className="bg-transparent w-full items-center gap-4 text-white flex justify-center mt-[50vh]">
          <LoadingState pageName="Reagent" />
        </div>
      </div>
    )

  // content
  return (
    <Overlay>
      <div
        className="
    font-family-sans h-full w-full min-h-screen md:flex md:items-center md:justify-center
    background-gradient md:p-[2rem] md:-mt-[2rem] mb-[6rem] md:mb-0
    "
      >
        <div className="md:max-w-6xl mx-auto w-full">
          <div className="md:max-w-6xl mx-auto">
            {/* mobile header img */}
            <div className="md:hidden relative overflow-hidden h-[25rem]">
              <Image
                src={reagent.images?.[0] ?? "/placeholder.webp"}
                alt="Reagent"
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-primary -mt-[1.3rem] relative z-10 rounded-t-3xl lg:mt-0 md:mb-0 md:rounded-none md:z-auto md:bg-transparent">
              <div className="flex flex-col items-start">
                {/* reagent name */}
                <h1 className="w-full text-center text-3xl md:text-4xl ml-0 mt-[2rem] md:mt-0 mb-[1rem] text-white tracking-wider">
                  {reagent.name}
                </h1>
                {/* metadata */}
                <div className="flex flex-col md:flex-row justify-center items-center w-full gap-3 md:gap-7">
                  <h5 className="flex text-[#43C05A] dark:text-[#78F58F] items-center text-[0.8rem]">
                    <FaRegClock className="text-[#43C05A] dark:text-[#78F58F] mr-[0.3rem] w-5 h-5" />{" "}
                    Listed —{" "}
                    {reagent.createdAtReadable
                      ? reagent.createdAtReadable
                      : "N/A"}
                  </h5>
                  <h5 className="flex text-[#E5595B] dark:text-[#FF797B] items-center text-[0.8rem]">
                    <LuClockAlert className="text-[#E5595B] dark:text-[#FF797B] mr-[0.3rem] w-5 h-5" />
                    Expires — {reagent.expiryDate}
                  </h5>
                  <h5 className="flex text-[#58A3E2] dark:text-[#71BEFF] items-center text-[0.8rem]">
                    <LuHouse className="text-[#58A3E2] dark:text-[#71BEFF] mr-[0.3rem] w-5 h-5" />{" "}
                    Location — {reagent.location}
                  </h5>
                </div>
              </div>
              <div className="flex md:flex-row flex-col justify-center items-center mt-12 gap-12 md:gap-0">
                {/* img carousel */}
                {reagent.images && (
                  <div className="order-2 md:order-1">
                    <ImageCarousel images={reagent.images} />
                  </div>
                )}
                {/* reagent info */}
                <div className="flex-[1.2] order-1 md:order-2 w-full px-9">
                  <div className="rounded-[8px] overflow-hidden shadow-[0_4px_6px_rgba(0,0,0,0.4)]">
                    <div
                      className={`text-center py-[1rem] ${
                        reagent.tradingType === "giveaway"
                          ? "bg-blue-primary text-[#327FB5]"
                          : reagent.tradingType === "sell"
                            ? "bg-blue-primary  text-[#428B44]"
                            : reagent.tradingType === "trade"
                              ? "bg-blue-primary text-[#9B7856]"
                              : "bg-blue-primary/75"
                      }`}
                    >
                      <h4 className="text-lg md:text-xl text-white/80">
                        Trading Type
                      </h4>
                      <h2 className="text-2xl md:text-4xl capitalize">
                        {reagent.tradingType}
                      </h2>
                    </div>
                    <div className="flex flex-col bg-primary gap-2 p-4">
                      <div className="mb-[1rem]">
                        <p className="text-white">
                          <span className="text-white/80">Quantity:</span>{" "}
                          {reagent.quantity}
                        </p>
                        <p className="text-white">
                          <span className="text-white/80">Unit:</span>{" "}
                          {reagent.unit || "Not specified"}
                        </p>
                      </div>
                      <div className="">
                        <p className="text-white">
                          {reagent.description ? (
                            <span className="text-white/80 ">
                              Description: {reagent.description}
                            </span>
                          ) : (
                            "No description provided for this reagent."
                          )}
                        </p>
                        <div className="mt-[2rem] flex">
                          {reagent.restricted && (
                            <div className="px-2 py-1 mr-[1rem] text-xs rounded-lg font-medium tracking-widest text-white bg-red-400/70">
                              restricted
                            </div>
                          )}
                          {reagent.categories?.map((tag) => {
                            return (
                              <div
                                className="px-2 py-1 mr-[1rem] text-xs rounded-lg font-medium tracking-widest text-white bg-secondary/30"
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
          {/* spacer div to prevent content from being covered by 'mobile contact seller' section */}
          <div className="bg-primary md:hidden h-[6rem]" />

          {/* mobile contact seller section */}
          <div className="fixed bottom-0 w-full md:hidden bg-background z-10 rounded-t-3xl">
            <div
              className={`flex h-[8rem] ${reagent.tradingType == "sell" ? "justify-between" : "justify-center"}`}
            >
              {reagent.tradingType == "sell" && (
                <span className="flex flex-col justify-center ml-[2rem]">
                  <p className="text-white/60 text-[1.1rem]">Price</p>
                  <h2 className="text-green-500">${reagent.price}</h2>
                </span>
              )}
              <div className="flex items-center mr-[2rem]">
                <SellerContact
                  reagent={
                    reagent
                      ? {
                          ...reagent,
                          id: reagentId,
                          createdAt: reagent.createdAt ?? "",
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* widescreen view contact seller section */}
          <div className="hidden md:block mt-[2rem]">
            <div className="flex flex-col items-center gap-2">
              <div className="w-[80vw] max-w-2xl min-w-xl mx-auto my-[1rem] border-t border-light-gray" />
              <div className="max-w-2xl mx-auto grid grid-cols-4 mb-[0.1rem]">
                <h4 className="text-left text-white tracking-wider col-span-1">
                  <b>Seller Details</b>
                </h4>
              </div>
              <SellerContact
                sellerInfo={sellerInfo}
                reagent={
                  reagent
                    ? {
                        ...reagent,
                        id: reagentId,
                        createdAt: reagent.createdAt ?? "",
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </div>
    </Overlay>
  )
}
