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
  const [condition, setCondition] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")

  const sendForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !condition || !quantity || !unit) {
      alert("Please fill in every required field!")
      return
    }

    const reagentData: CreateReagentRequest = {
      userId: "placeholder-id",
      name,
      description: ``,
      tradingType,
      categories,
      expiryDate: "2029-09-09",
      images: undefined,
      price: undefined,
    }

    onSubmit(reagentData)
  }

  return (
    <form onSubmit={sendForm} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Reagent Name</label>
        <input
          className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Reagent Name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Listing Type</label>
        <select
          value={tradingType}
          onChange={(e) => setTradingType(e.target.value as ReagentTradingType)}
          className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
        >
          {TRADING_TYPES.map((type) => (
            <option key={type} value={type} className="bg-primary">
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Condition</label>
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="new, used, expired"
          className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="10"
            className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Unit</label>
          <input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="mL, g, bottles"
            className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-between">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-red-400">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-primary text-white rounded-lg hover:bg-blue-primary/75">Create</button>
      </div>
    </form>
  )
}

export default ReagentForm