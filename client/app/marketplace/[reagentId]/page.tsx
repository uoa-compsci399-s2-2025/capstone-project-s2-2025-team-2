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
import {
  GiftIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"

interface ReagentViewProps {
  params: Promise<{ reagentId: string }>
}

export default function ReagentView({ params }: ReagentViewProps) {
  const { reagentId } = use(params)
  const [sellerInfo, setSellerInfo] = useState<any>(null)
  const [reagent, setReagent] = useState<Reagent | null>(null)
  const TYPE_STYLES: any = {
    giveaway: { color: "text-blue-100", Icon: GiftIcon },
    sell: { color: "text-green-100", Icon: CurrencyDollarIcon },
    trade: { color: "text-purple-100", Icon: ArrowsRightLeftIcon },
  }
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
            <div className="bg-primary -mt-18 relative z-10 rounded-t-3xl lg:mt-0 md:mb-0 md:rounded-none md:z-auto md:bg-transparent">
              <div className="hidden" />
              <div className="flex md:flex-row flex-col justify-center items-start md:items-stretch mt-12 gap-12 md:gap-0">
                {/* img carousel */}
                {reagent.images && (
                  <div className="order-2 md:order-1 mx-16 hover:border-white/40 duration-300 hover:shadow-lg md:m-0 self-stretch border border-white/30 py-6 rounded-2xl bg-black/30">
                    <ImageCarousel images={reagent.images} />
                  </div>
                )}
                {/* reagent info */}
                <div className="order-1 md:mt-0 mt-10 md:order-2 w-full px-9 md:flex-none md:w-[38rem] md:self-stretch">
                  <div className="h-full shadow-lg hover:border-white/30 duration-300 bg-secondary/10 border border-white/20 backdrop-blur-md rounded-2xl p-6 md:p-8">
                    {/* trading type header */}
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                      {(() => {
                        const style =
                          TYPE_STYLES[
                            (reagent.tradingType as any) || "giveaway"
                          ]
                        const IconC = style?.Icon || GiftIcon
                        const color = style?.color || "text-blue-100"
                        return (
                          <>
                            <IconC className={`w-6 h-6 ${color}`} />
                            <span
                              className={`text-xl md:text-2xl font-medium capitalize ${color}`}
                            >
                              {reagent.tradingType}
                            </span>
                          </>
                        )
                      })()}
                    </div>

                    {/*reagent name (quantity + unit)*/}
                    <h1 className="text-2xl md:text-3xl text-white tracking-wider mb-3 text-center md:text-left">
                      {reagent.name}{" "}
                      {reagent.quantity && reagent.unit && (
                        <span className="text-white/70 text-base md:text-lg font-normal">
                          ({reagent.quantity}
                          {reagent.unit})
                        </span>
                      )}
                    </h1>

                    {/*listed date, expiry date, location*/}
                    <div className="flex flex-wrap items-center gap-3 mb-6 justify-start">
                      <span className="flex items-center text-[#43C05A] text-sm font-semibold">
                        <FaRegClock className="mr-1 w-4 h-4" />
                        Listed — {reagent.createdAtReadable || "N/A"}
                      </span>
                      <span className="flex items-center text-red-500 text-sm font-semibold">
                        <LuClockAlert className="mr-1 w-4 h-4" />
                        Expires — {reagent.expiryDate}
                      </span>
                      <span className="flex items-center text-[#58A3E2] text-sm font-semibold">
                        <LuHouse className="mr-1 w-4 h-4" />
                        Location — {reagent.location}
                      </span>
                    </div>

                    {/*description*/}
                    <div className="mb-6 text-base">
                      <span className="text-gray-300 mb-1 block">
                        Description:
                      </span>
                      <p className="text-white/90 leading-relaxed line-clamp-4 border-b border-white/20 pb-2">
                        {reagent.description ||
                          "No description provided for this reagent."}
                      </p>
                    </div>

                    {/*display tags*/}
                    <div className="mt-4 text-base">
                      <p className="text-gray-300 mb-2 block">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {reagent.restricted && (
                          <span className="shadow-lg px-2 py-1 text-xs rounded-lg font-medium tracking-widest text-white bg-red-500/70">
                            restricted
                          </span>
                        )}
                        {reagent.categories?.map((tag) => (
                          <span
                            key={tag}
                            className="shadow-lg px-2 py-1 text-xs rounded-lg font-medium tracking-widest text-white bg-secondary/30"
                          >
                            {tag}
                          </span>
                        ))}
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
