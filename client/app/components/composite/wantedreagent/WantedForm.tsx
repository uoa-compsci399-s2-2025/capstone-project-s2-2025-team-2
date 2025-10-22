"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import { useEffect } from "react"

type ReagentTradingType = components["schemas"]["ReagentTradingType"]
type ReagentCategory = components["schemas"]["ReagentCategory"]

const TRADING_TYPES: ReagentTradingType[] = ["trade", "giveaway", "sell"]
const CATEGORIES: ReagentCategory[] = ["chemical", "hazardous", "biological"]

interface WantedFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

interface FormData {
  name: string
  description: string
  categories: ReagentCategory[]
  tradingType: ReagentTradingType
  location: string
  price?: string
  requesterOfferedReagentId?: string
}

type Reagent = components["schemas"]["Reagent"]
type ReagentWithId = Reagent & { id: string }

interface CreateWantedRequest {
  name: string
  description: string
  location: string
  categories: ReagentCategory[]
  tradingType: ReagentTradingType
  price?: number
  requesterOfferedReagentId?: string
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

export const WantedForm = ({ onSubmit, onCancel }: WantedFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    tradingType: "trade",
    categories: ["chemical"],
    description: "",
    price: "",
    location: "",
    requesterOfferedReagentId: "",
  })

  const [dataSubmitting, setDataSubmitting] = useState(false)
  const [userReagents, setUserReagents] = useState<ReagentWithId[]>([])
  const [selectedReagentId, setSelectedReagentId] = useState<string>("")

  useEffect(() => {
    // Only fetch when user chooses 'trade' as listing type
    if (formData.tradingType !== "trade") return

    const fetchUserReagents = async () => {
      try {
        const token = localStorage.getItem("authToken")
        if (!token) return

        const { data: reagents, error } = await client.GET(
          "/users/reagents" as any,
          { headers: { Authorization: `Bearer ${token}` } },
        )

        if (error) {
          console.error("Failed to fetch user reagents:", error)
          setUserReagents([])
          return
        }

        setUserReagents(reagents || [])
        if (reagents && reagents.length > 0) {
          setSelectedReagentId(reagents[0].id)
        }
      } catch (err) {
        console.error("Error fetching user reagents:", err)
        setUserReagents([])
      }
    }

    fetchUserReagents()
  }, [formData.tradingType])

  const handleFieldChange = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((current) => ({ ...current, [field]: value }))
    },
    [],
  )
  const selectCategory = (category: ReagentCategory) => {
    const selected = formData.categories.includes(category)
    const updated = selected
      ? formData.categories.filter((c) => c !== category)
      : [...formData.categories, category]
    handleFieldChange("categories", updated)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // stop people from spamming the fk out of the submit btn
    if (dataSubmitting) return

    setDataSubmitting(true)

    //at least one category selected
    if (!formData.categories.length) {
      toast("Please select at least one tag")
      setDataSubmitting(false)
      return
    }

    try {
      //fetch token from localStorage
      const idToken = localStorage.getItem("authToken")
      if (!idToken) {
        toast("Please sign in to create a reagent.")
        setDataSubmitting(false)
        return
      }
      const wantedData: CreateWantedRequest = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        categories: formData.categories,
        tradingType: formData.tradingType,
        price:
          formData.tradingType === "sell" && formData.price
            ? Number(formData.price)
            : 0,
        requesterOfferedReagentId:
          formData.tradingType === "trade" && formData.requesterOfferedReagentId
            ? formData.requesterOfferedReagentId
            : undefined,
      }
      console.log("Token:", idToken)
      console.log("Token starts with Bearer?:", idToken.startsWith("Bearer "))
      const { data: createdWantedReagent, error } = await client.POST(
        "/wanted" as any,
        {
          body: wantedData,
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )
      if (error) {
        throw new Error("Failed to create wanted listing")
      }
      const createdReagent = createdWantedReagent as any
      toast.success("Wanted listing created successfully!")
      onSubmit(createdReagent)
    } catch (error) {
      console.error("Error submitting wanted listing:", error)
      toast.error(`Error creating wanted listing`)
    } finally {
      setDataSubmitting(false)
    }
  }

  const formInput = (
    // image input doesnt consume this func, so exclude "images" field
    field: Exclude<keyof FormData, "images">,
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
        label="Name"
        required
        input={formInput("name", {
          placeholder: "Enter reagent name",
          required: true,
        })}
      />
      <FormField
        label="Message"
        required
        input={formInput("description", {
          placeholder: "Enter a message to describe what you need",
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
      />{" "}
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
      {formData.tradingType === "trade" && (
        <FormField
          label="Offer one of your reagents"
          input={
            <select
              value={formData.requesterOfferedReagentId}
              onChange={(e) =>
                handleFieldChange("requesterOfferedReagentId", e.target.value)
              }
              className={inputStyles}
              disabled={dataSubmitting || userReagents.length === 0}
            >
              {userReagents.length === 0 ? (
                <option value="">Select a Reagent</option>
              ) : (
                userReagents.map((r) => (
                  <option key={r.id} value={r.id} className="bg-primary">
                    {r.name}
                  </option>
                ))
              )}
            </select>
          }
        />
      )}
      <FormField
        label="Location"
        required
        input={formInput("location", {
          placeholder: "Current location",
          required: true,
        })}
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
          disabled={dataSubmitting}
          className={`${buttonStyles} min-w-[120px] bg-blue-primary hover:bg-blue-primary/80 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {dataSubmitting ? "Submitting..." : "Create Request"}
        </button>
      </div>
    </form>
  )
}
