"use client"

import React from "react"
import { BeakerIcon } from "@heroicons/react/20/solid"
import type { components } from "@/models/__generated__/schema"

type ReagentTradingType = components["schemas"]["ReagentTradingType"]
type Reagent = components["schemas"]["Reagent"]

interface ReagentRequestProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  reagent: Reagent
  requesterName: string
  ownerName: string
  tradingType: ReagentTradingType
  ownedReagent?: Reagent 
}

const ARROWS = {
  bidir: "↔",
  left: "←",
  right: "→"
} as const

//trading req types
const TRADING_TYPES = {
  trade: {
    header: 'Trade',
    arrow: 'bidir' as const,
    requesterIcon: true,
    ownerIcon: true,
    showOwnedReagent: true,
    showReqReagent: true,
    ownedReagentLabel: 'ownedReagent.name',
    reqReagentLabel: 'reagent.name',
  },
  giveaway: {
    header: 'Giveaway',
    arrow: 'left' as const,
    requesterIcon: false,
    ownerIcon: true,
    showOwnedReagent: false,
    showReqReagent: true,
    ownedReagentLabel: null,
    reqReagentLabel: 'reagent.name',
  }
} as const

//reusable styling classes
const buttonStyles = "px-4 py-2 text-white rounded-lg"

const ChemIcon = () => (
  <div className="inline-flex items-center justify-center bg-blue-primary text-white rounded-full p-2">
    <BeakerIcon className="w-6 h-6" />
  </div>
)

//display user + reagent 
const UserDisplay = ({ 
  name, 
  reagentName, 
  showIcon 
}: { 
  name: string
  reagentName?: string
  showIcon?: boolean 
}) => (
  <div className="flex flex-col items-center flex-1">
    <div className="flex items-center gap-3">
      <div className="text-white text-3xl font-semibold">{name}</div>
      {showIcon && <ChemIcon />}
    </div>
    {reagentName && (
      <div className="text-gray-400 text-base font-light mt-2">{reagentName}</div>
    )}
  </div>
)

export const ReagentRequest = ({
  isOpen,
  onClose,
  onSubmit,
  reagent,
  requesterName,
  ownerName,
  tradingType,
  ownedReagent
}: ReagentRequestProps) => {
  
  if (!isOpen) return null

  const handleSubmit = () => {
    onSubmit()
    onClose()
  }

  //trading type config
  const config = TRADING_TYPES[tradingType as keyof typeof TRADING_TYPES]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="relative w-full max-w-lg bg-primary rounded-2xl p-8 border border-muted">
        <h2 className="text-white text-center text-2xl font-medium mb-8">
          {config.header}
        </h2>

        <div className="flex items-center justify-center mb-8">
           {/*Reagent Requester*/}
           <UserDisplay 
             name={requesterName}
             reagentName={config.showOwnedReagent ? ownedReagent?.name : undefined}
             showIcon={config.requesterIcon}
           />

          
          <span className="px-4 text-4xl text-gray-400">
            {ARROWS[config.arrow]}
          </span>

           {/*Reagent Sender*/}
           <UserDisplay 
             name={ownerName}
             reagentName={config.showReqReagent ? reagent.name : undefined}
             showIcon={config.ownerIcon}
           />
        </div>
        <div className="flex justify-end">
          <button 
            type="button"
            onClick={handleSubmit}
            className={`${buttonStyles} bg-blue-primary hover:bg-blue-primary/80 min-w-[120px] text-base font-medium py-1 px-3`}
          >
            Request {ARROWS.right}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReagentRequest