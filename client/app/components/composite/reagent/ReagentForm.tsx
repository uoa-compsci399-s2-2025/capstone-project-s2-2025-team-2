"use client"

import { useState } from "react"
import type { components } from "@/models/__generated__/schema"

type ReagentTradingType = components["schemas"]["ReagentTradingType"]
type ReagentCategory = components["schemas"]["ReagentCategory"]
type CreateReagentRequest = components["schemas"]["CreateReagentRequest"]
type ReagentVisibility = components["schemas"]["ReagentVisibility"]

const TRADING_TYPES: ReagentTradingType[] = ["trade","giveaway","sell"]
const TAGS: ReagentCategory[] = ["chemical","hazardous","biological"]
const VISIBILITY_OPTIONS: ReagentVisibility[] = ["everyone","region","institution"]

interface ReagentFormProps {
    onSubmit: (data: CreateReagentRequest) => void
    onCancel: () => void
}

export const ReagentForm = ({ onSubmit, onCancel }: ReagentFormProps) => {
  const [name, setName] = useState("")
  const [tradingType, setTradingType] = useState<ReagentTradingType>("trade")
  const [tags, setTags] = useState<ReagentCategory[]>(["chemical"]) // del note: change to category or tag, pick one 
  const [visibility, setVisibility] = useState<ReagentVisibility>("everyone")
  const [description, setDescription] = useState("")
  const [condition, setCondition] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")
  const [price, setPrice] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [location, setLocation] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [imageUrl, setImageUrl] = useState("")


  const sendForm = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !condition || !quantity || !unit || !expiryDate || !location) {
      alert("Please fill in every required field!")
      return
    }

    const reagentData: CreateReagentRequest = {
      userId: "placeholder-id",
      name,
      description,
      tradingType,
      categories: tags,
      expiryDate,
      images: images.length > 0 ? images : undefined,
      location,
      price: tradingType === "sell" && price ? Number(price) : undefined,
      quantity: Number(quantity),
      unit,
      visibility,
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

      <div className="grid grid-cols-2 gap-4">
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
          <label className="block text-sm font-medium text-white">Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as ReagentVisibility)}
            className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          >
            {VISIBILITY_OPTIONS.map((v) => (
              <option key={v} value={v} className="bg-primary">
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Condition</label>
        <input
          type="text"
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          placeholder="Condition"
          className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Expiry Date</label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Current Reagent Location"
            className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Listing Images (5 max)</label>
        <div className="flex gap-2">
           <input
             type="text"
             value={imageUrl}
             onChange={(e) => setImageUrl(e.target.value)}
             placeholder="Image URL"
             className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
           />

             <button
               type="button"
               onClick={() => {
                 if (images.length < 5) {
                   setImages((currentImages) => [...currentImages, imageUrl])
                   setImageUrl("")
                 }
               }}
               disabled={images.length >= 5}
               className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-400 disabled:bg-red-400 disabled:cursor-not-allowed"
             >
               Add
             </button>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((url, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 border border-muted rounded-lg bg-primary/50 max-w-[200px]"
              >
                <span className="text-white text-sm truncate flex-1">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => setImages((currentImages) => currentImages.filter((img) => img !== url))}
                  className="text-red-400 hover:text-red-300 text-sm flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
        />
      </div>

      {tradingType === "sell" && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Unit Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="$0.00"
            className="w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
          />
        </div>
      )}

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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-white">Reagent Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const checked = tags.includes(tag)
            return (
              <label
                key={tag}
                className="flex items-center gap-2 px-3 py-2 border border-muted rounded-lg"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 border-muted"
                  checked={checked}
                  onChange={() =>
                    setTags((currentTags) =>
                      currentTags.includes(tag)
                        ? currentTags.filter((t) => t !== tag)
                        : [...currentTags, tag]
                    )
                  }
                />
                <span className="text-white text-sm">{tag}</span>
              </label>
            )
          })}
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