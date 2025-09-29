"use client"

import { useState, useCallback, useMemo } from "react"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import { toast } from "sonner"

type ReagentTradingType = components["schemas"]["ReagentTradingType"]
type ReagentCategory = components["schemas"]["ReagentCategory"]
type ReagentVisibility = components["schemas"]["ReagentVisibility"]
type CreateReagentRequest = components["schemas"]["CreateReagentRequest"]

//note: hardcoded for now?
const TRADING_TYPES: ReagentTradingType[] = ["trade", "giveaway", "sell"]
const CATEGORIES: ReagentCategory[] = ["chemical", "hazardous", "biological"]
const VISIBILITY_OPTIONS: ReagentVisibility[] = [
  "everyone",
  "region",
  "institution",
  "private",
]
const MAX_IMAGES = 5

interface ReagentFormProps {
  onSubmit: (data: CreateReagentRequest) => void
  onCancel: () => void
}

interface FormData {
  name: string
  tradingType: ReagentTradingType
  categories: ReagentCategory[]
  description: string
  condition: string
  visibility: ReagentVisibility
  quantity: string
  unit: string
  price: string
  expiryDate: string
  location: string
  images: string[]
}

//reusable styling classes
const inputStyles =
  "w-full px-3 py-2 border border-muted rounded-lg bg-primary/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-transparent"
const labelStyles = "block text-sm font-medium text-white"
const buttonStyles = "px-4 py-2 text-white rounded-lg"

//input fields wrapper
const FormField = ({
  label,
  required = false,
  input,
  className = "",
}: {
  label: string
  required?: boolean
  input: React.ReactNode
  className?: string
}) => (
  <div className={`space-y-2 ${className}`}>
    <label className={labelStyles}>
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {input}
  </div>
)

export const ReagentForm = ({ onSubmit, onCancel }: ReagentFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    tradingType: "trade",
    categories: ["chemical"],
    description: "",
    condition: "",
    visibility: "everyone",
    quantity: "1",
    unit: "",
    price: "",
    expiryDate: "",
    location: "",
    images: [],
  })
  const [imageUrl, setImageUrl] = useState("")

  //today date calc
  const todaysDate = useMemo(() => new Date().toISOString().split("T")[0], [])

  //update field data
  const handleFieldChange = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((current) => ({ ...current, [field]: value }))
    },
    [],
  )

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    //at least one category selected
    if (!formData.categories.length) {
      toast("Please select at least one tag")
      return
    }

    const reagentData: CreateReagentRequest = {
      name: formData.name,
      description: formData.description,
      condition: formData.condition,
      tradingType: formData.tradingType,
      categories: formData.categories,
      expiryDate: formData.expiryDate,
      images: formData.images.length ? formData.images : undefined,
      location: formData.location,
      visibility: formData.visibility,
      //only include price if selling
      price:
        formData.tradingType === "sell" && formData.price
          ? Number(formData.price)
          : undefined,
      quantity: Number(formData.quantity),
      unit: formData.unit,
    }

    try {
      //fetch token from localStorage
      const idToken = localStorage.getItem("authToken")
      if (!idToken) {
        toast("Please sign in to create a reagent.")
        return
      }

      const { error } = await client.POST("/users/reagents" as any, {
        body: reagentData,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (error) {
        throw new Error("Failed to create reagent")
      }

      toast("Reagent created successfully!")
      onSubmit(reagentData)
    } catch {
      toast("Failed to create reagent!")
    }
  }

  const addImage = () => {
    const url = imageUrl.trim()

    //validation checks
    if (!url) return
    if (formData.images.length >= MAX_IMAGES) return
    if (formData.images.includes(url)) {
      toast("URL has already been added")
      return
    }
    try {
      new URL(url)
    } catch {
      toast("Invalid URL")
      return
    }

    handleFieldChange("images", [...formData.images, url])
    setImageUrl("")
  }

  const removeImage = (url: string) => {
    const filtered = formData.images.filter((img) => img !== url)
    handleFieldChange("images", filtered)
  }

  const selectCategory = (category: ReagentCategory) => {
    const selected = formData.categories.includes(category)
    const updated = selected
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category]
    handleFieldChange("categories", updated)
  }

  const formInput = (
    field: keyof FormData,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => (
    <input
      value={formData[field]}
      onChange={(e) => handleFieldChange(field, e.target.value)}
      className={inputStyles}
      {...props}
    />
  )

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <FormField
        label="Reagent Name"
        required
        input={formInput("name", {
          placeholder: "Reagent name",
          required: true,
        })}
      />

      <FormField
        label="Listing Type"
        input={
          <select
            value={formData.tradingType}
            onChange={(e) =>
              handleFieldChange(
                "tradingType",
                e.target.value as ReagentTradingType,
              )
            }
            className={inputStyles}
          >
            {TRADING_TYPES.map((type) => (
              <option key={type} value={type} className="bg-primary">
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        }
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Condition"
          required
          input={formInput("condition", {
            placeholder: "e.g. New, Opened and unused",
            required: true,
          })}
        />
        <FormField
          label="Visibility"
          input={
            <select
              value={formData.visibility}
              onChange={(e) =>
                handleFieldChange(
                  "visibility",
                  e.target.value as ReagentVisibility,
                )
              }
              className={inputStyles}
            >
              {VISIBILITY_OPTIONS.map((option) => (
                <option key={option} value={option} className="bg-primary">
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Expiry Date"
          required
          input={formInput("expiryDate", {
            type: "date",
            min: todaysDate,
            required: true,
          })}
        />
        <FormField
          label="Location"
          required
          input={formInput("location", {
            placeholder: "Current location",
            required: true,
          })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Quantity"
          required
          input={formInput("quantity", {
            type: "number",
            placeholder: "10",
            min: "0",
            required: true,
          })}
        />
        <FormField
          label="Unit"
          required
          input={formInput("unit", {
            placeholder: "g, mL, etc.",
            required: true,
          })}
        />
      </div>

      {formData.tradingType === "sell" && (
        <FormField
          label="Unit Price"
          input={formInput("price", {
            type: "number",
            placeholder: "0.00",
            min: "0",
          })}
        />
      )}

      <FormField
        label="Description"
        input={
          <textarea
            value={formData.description}
            onChange={(e) => handleFieldChange("description", e.target.value)}
            placeholder="Additional reagent details"
            rows={3}
            className={`${inputStyles} min-h-[80px] resize-y`}
          />
        }
      />

      <FormField
        label="Categories"
        input={
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const selected = formData.categories.includes(cat)
              return (
                <label
                  key={cat}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
                    selected
                      ? "border-blue-primary bg-blue-primary/20"
                      : "border-muted hover:border-gray-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4"
                    checked={selected}
                    onChange={() => selectCategory(cat)}
                  />
                  <span className="text-white text-sm capitalize">{cat}</span>
                </label>
              )
            })}
          </div>
        }
      />

      <FormField
        label={`Images (${formData.images.length}/${MAX_IMAGES})`}
        input={
          <>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={formData.images.length >= MAX_IMAGES}
                className={inputStyles}
              />
              <button
                type="button"
                onClick={addImage}
                disabled={
                  formData.images.length >= MAX_IMAGES || !imageUrl.trim()
                }
                className={`${buttonStyles} min-w-[80px] bg-gray-600 hover:bg-gray-500`}
              >
                Add
              </button>
            </div>

            {/* image list */}
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.images.map((url, i) => (
                  <div
                    key={`img-${i}`}
                    className="flex items-center gap-2 px-3 py-1.5 border border-muted rounded-lg bg-primary/30 max-w-xs group hover:bg-primary/40 transition-colors"
                  >
                    <span
                      className="text-white text-sm truncate flex-1"
                      title={url}
                    >
                      {url}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        }
      />

      <div className="flex justify-between pt-4 border-t border-muted">
        <button
          type="button"
          onClick={onCancel}
          className={`${buttonStyles} bg-gray-600 hover:bg-red-500`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${buttonStyles} min-w-[120px] bg-blue-primary hover:bg-blue-primary/80`}
        >
          Create Reagent
        </button>
      </div>
    </form>
  )
}

export default ReagentForm
