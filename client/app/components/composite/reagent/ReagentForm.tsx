"use client"

import { useState } from "react"
import type { components } from "@/models/__generated__/schema"

type ReagentTradingType = components["schemas"]["ReagentTradingType"]
type ReagentCategory = components["schemas"]["ReagentCategory"]
type CreateReagentRequest = components["schemas"]["CreateReagentRequest"]

const TRADING_TYPES: ReagentTradingType[] = ["trade","giveaway","sell"]
const CATEGORIES: ReagentCategory[] = ["chemical","hazardous","biological"]


interface ReagentFormProps {
    onSubmit: (data: CreateReagentRequest) => void
    onCancel: () => void
}

export const ReagentForm = ({ onSubmit, onCancel }: ReagentFormProps) => {
  const [name, setName] = useState("")
  const [tradingType, setTradingType] = useState<ReagentTradingType>("trade")
  const [categories, setCategories] = useState<ReagentCategory[]>(["chemical"])

  const sendForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      alert("please enter a reagent name")
      return
    }

    const reagentData: CreateReagentRequest = {
      userId: "placeholder-id",
      name,
      description: "",
      tradingType,
      categories,
      expiryDate: "2029-09-09",
      images: undefined,
      price: undefined,
    }

    onSubmit(reagentData)
  }

  return (
    <form onSubmit={sendForm}>
      <label>
        Name
        <input
          className="bg-white"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Reagent Name"
        />
      </label>

      <div>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Create</button>
      </div>
    </form>
  )
}

export default ReagentForm