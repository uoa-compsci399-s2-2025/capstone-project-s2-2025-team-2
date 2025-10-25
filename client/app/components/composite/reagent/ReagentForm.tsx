"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import { uploadReagentImage } from "../../../services/firebase-storage"

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
  onSubmit: (data: any) => void // Changed to accept the full reagent data
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
  images: File[]
  restricted: boolean
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
    restricted: false,
  })

  const [dataSubmitting, setDataSubmitting] = useState(false)

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

      // because image uploading functionality depends on the reagent uid, create reagent w/o images first
      const reagentData: CreateReagentRequest = {
        name: formData.name,
        description: formData.description,
        condition: formData.condition,
        tradingType: formData.tradingType,
        categories: formData.categories,
        expiryDate: formData.expiryDate,
        images: [],
        location: formData.location,
        visibility: formData.visibility,
        //only include price if selling
        price:
          formData.tradingType === "sell" && formData.price
            ? Number(formData.price)
            : 0,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        restricted: formData.restricted,
      }

      console.log("Token:", idToken)
      console.log("Token starts with Bearer?:", idToken.startsWith("Bearer "))

      // STEP 1 -- create the reagent (without images)
      const { data: createdReagent, error } = await client.POST(
        "/users/reagents" as any,
        {
          body: reagentData,
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      if (error) {
        throw new Error("Failed to create reagent")
      }

      // Variable to track the final reagent data
      let finalReagentData = createdReagent

      // STEP 2 -- once we have the actual reagent data from db, update reagent data w/ images
      if (formData.images.length > 0) {
        toast("Uploading images...")
        const imageUrls: string[] = []

        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i]
          const imgUrl = await uploadReagentImage(createdReagent.id, file)

          imgUrl
            ? imageUrls.push(imgUrl)
            : toast(`Failed to upload image '${file.name}'`)
        }

        if (imageUrls.length > 0) {
          const { data: updatedReagent, error } = await client.PATCH(
            `/users/reagents/${createdReagent.id}` as any,
            {
              body: { images: imageUrls },
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            },
          )

          if (error) {
            console.error(`Failed to update reagent data with images: ${error}`)
            toast("Failed to upload some reagent images")
          } else if (updatedReagent) {
            // Use the updated reagent data if available
            finalReagentData = updatedReagent
          }
        }
      }

      // STEP 3 -- Fetch the complete reagent data to ensure we have all server-generated fields
      const { data: completeReagent, error: fetchError } = await client.GET(
        `/users/reagents/${createdReagent.id}` as any,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      if (!fetchError && completeReagent) {
        finalReagentData = completeReagent
      }

      toast("Reagent created successfully!")
      onSubmit(finalReagentData)
    } catch (error) {
      console.error("Error creating reagent:", error)
      toast("Failed to create reagent!")
    } finally {
      setDataSubmitting(false)
    }
  }

  const addImage = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles: File[] = []

    // file input doesnt store state from prev usage so we need to compare newly selected files w formData.images state
    for (let i = 0; i < files.length; i++) {
      const currFile = files[i]

      if (formData.images.length + newFiles.length >= MAX_IMAGES) {
        toast(`You can't select more than ${MAX_IMAGES} images`)
        break
      }

      const isDupe = formData.images.some(
        (existingFile) => existingFile.name === currFile.name,
      )

      if (isDupe) {
        toast(`File "${currFile.name}" has already been added`)
        continue
      }

      newFiles.push(currFile)
    }

    if (newFiles.length > 0) {
      handleFieldChange("images", [...formData.images, ...newFiles])
    }
  }

  const removeImage = (imgToRemove: File) => {
    const filtered = formData.images.filter((img) => img !== imgToRemove)
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
    // image input + restricted field dont consume this func, so exclude both fields
    field: Exclude<keyof FormData, "images" | "restricted">,
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
                type="file"
                accept="image/*"
                multiple
                disabled={formData.images.length >= MAX_IMAGES}
                onChange={(e) => addImage(e.target.files)}
                className={inputStyles}
              />
            </div>

            {/* image list */}
            {formData.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.images.map((file, i) => (
                  <div
                    key={`img-${i}`}
                    className="flex items-center gap-2 px-3 py-1.5 border border-muted rounded-lg bg-primary/30 max-w-xs group hover:bg-primary/40 transition-colors"
                  >
                    <span
                      className="text-white text-sm truncate flex-1"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeImage(file)}
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

      <FormField
        label="Restricted Access"
        input={
          <label
            className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer ${
              formData.restricted
                ? "border-blue-primary bg-blue-primary/20"
                : "border-muted hover:border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              id="restricted"
              checked={formData.restricted}
              onChange={(e) => handleFieldChange("restricted", e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-white text-sm">
              This reagent is subject to strict regulations and requires special approval.
            </span>
          </label>
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
          {dataSubmitting ? "Submitting..." : "Create Reagent"}
        </button>
      </div>
    </form>
  )
}

export default ReagentForm
