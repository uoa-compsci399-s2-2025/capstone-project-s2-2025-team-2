"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "sonner"
import type { components } from "@/models/__generated__/schema"
import client from "../../../services/fetch-client"
import {
  uploadReagentImage,
  deleteReagentImage,
} from "../../../services/firebase-storage"

type ReagentTradingType = components["schemas"]["ReagentTradingType"]
type ReagentCategory = components["schemas"]["ReagentCategory"]
type ReagentVisibility = components["schemas"]["ReagentVisibility"]
type CreateReagentRequest = components["schemas"]["CreateReagentRequest"]
type Reagent = components["schemas"]["Reagent"]

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
  editMode?: boolean
  reagentData?: Reagent // existing reagent data for editing
  onDelete?: (reagentId: string) => void // delete handler func for reagent edit mode
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
  existingImages: string[] //the firebase storage urls of existing images
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

export const ReagentForm = ({
  onSubmit,
  onCancel,
  editMode = false,
  reagentData,
  onDelete,
}: ReagentFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: reagentData?.name || "",
    tradingType: reagentData?.tradingType || "trade",
    categories: reagentData?.categories || ["chemical"],
    description: reagentData?.description || "",
    condition: reagentData?.condition || "",
    visibility: reagentData?.visibility || "everyone",
    quantity: reagentData?.quantity?.toString() || "1",
    unit: reagentData?.unit || "",
    price: reagentData?.price?.toString() || "",
    expiryDate: reagentData?.expiryDate || "",
    location: reagentData?.location || "",
    images: [], // type File[]
    restricted: reagentData?.restricted || false,
    existingImages: reagentData?.images || [], // type string[] (firebase storage urls), which is why we have both images & existingImages
  })

  const [dataSubmitting, setDataSubmitting] = useState(false)
  const [deleteConfirmCooldown, setDeleteConfirmCooldown] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [deleteTimeout, setDeleteTimeout] = useState<NodeJS.Timeout | null>(
    null,
  )

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
        toast(`Please sign in to ${editMode ? "edit" : "create"} a reagent.`)
        setDataSubmitting(false)
        return
      }

      if (editMode && reagentData) {
        // EDIT MODE - handle image deletion & reagent a updates
        await handleEditReagent(idToken)
      } else {
        // CREATE MODE - create reagent
        await handleCreateReagent(idToken)
      }
    } catch (err) {
      console.error(
        `Error ${editMode ? "editing" : "creating"} reagent: ${err}`,
      )
      toast(`Failed to ${editMode ? "edit" : "create"} reagent`)
    } finally {
      setDataSubmitting(false)
    }
  }

  const handleCreateReagent = async (idToken: string) => {
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
  }

  const handleEditReagent = async (idToken: string) => {
    if (!reagentData) return

    // compare original images witw current existing images and find what imgs were removed
    const originalImages = reagentData.images || []
    const imagesToDelete = originalImages.filter(
      (img) => !formData.existingImages.includes(img),
    )

    if (imagesToDelete.length > 0) {
      toast("Removing images...")
      for (let i = 0; i < imagesToDelete.length; i++) {
        await deleteReagentImage(imagesToDelete[i])
      }
    }

    // upload new images if any
    const newImageUrls: string[] = []
    if (formData.images.length > 0) {
      toast("Uploading new images...")
      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i]
        const imgUrl = await uploadReagentImage((reagentData as any).id, file)

        imgUrl
          ? newImageUrls.push(imgUrl)
          : toast(`Failed to upload image '${file.name}'`)
      }
    }

    // update reagent w new data and images
    const updateData = {
      name: formData.name,
      description: formData.description,
      condition: formData.condition,
      tradingType: formData.tradingType,
      categories: formData.categories,
      expiryDate: formData.expiryDate,
      location: formData.location,
      visibility: formData.visibility,
      price:
        formData.tradingType === "sell" && formData.price
          ? Number(formData.price)
          : 0,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      images: [...formData.existingImages, ...newImageUrls],
    }

    const { data: updatedReagent, error } = await client.PATCH(
      `/users/reagents/${(reagentData as any).id}` as any,
      {
        body: updateData,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    )

    if (error) {
      throw new Error(`Failed to update reagent: ${error}`)
    }

    toast("Reagent updated successfully!")
    onSubmit(updatedReagent)
  }

  const addImage = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const newFiles: File[] = []

    // file input doesnt store state from prev usage so we need to compare newly selected files w formData.images state
    for (let i = 0; i < files.length; i++) {
      const currFile = files[i]

      if (
        formData.images.length +
          formData.existingImages.length +
          newFiles.length >=
        MAX_IMAGES
      ) {
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

  const removeExistingImage = (imgUrlToRemove: string) => {
    const filtered = formData.existingImages.filter(
      (img) => img !== imgUrlToRemove,
    )
    handleFieldChange("existingImages", filtered)
  }

  const handleDeleteReagent = async () => {
    if (!reagentData || !onDelete) return

    // prevent users from spamming delete btn
    if (deleting) return

    if (!deleteConfirmCooldown) {
      setDeleteConfirmCooldown(true)

      // 3 sec for users to confirm deletion
      const timeout = setTimeout(() => {
        setDeleteConfirmCooldown(false)
        setDeleteTimeout(null)
      }, 3000)
      setDeleteTimeout(timeout)
    } else {
      try {
        setDeleting(true)
        // clear delete btn confirmation cooldown if it exists
        if (deleteTimeout) {
          clearTimeout(deleteTimeout)
          setDeleteTimeout(null)
        }
        onDelete((reagentData as any).id)
        toast("Reagent deleted successfully")
      } catch (err) {
        console.error(`Error deleting reagent: ${err}`)
        toast("Failed to delete reagent")
      }
    }
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
        label={`Images (${formData.images.length + formData.existingImages.length}/${MAX_IMAGES})`}
        input={
          <>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                multiple
                disabled={
                  formData.images.length + formData.existingImages.length >=
                  MAX_IMAGES
                }
                onChange={(e) => addImage(e.target.files)}
                className={inputStyles}
              />
            </div>

            {/* existing images */}
            {formData.existingImages.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-300 mb-2">Existing images:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.existingImages.map((imgUrl, i) => (
                    <div
                      key={`existing-img-${i}`}
                      className="flex items-center gap-2 px-3 py-1.5 border border-muted rounded-lg bg-primary/30 max-w-xs group hover:bg-primary/40 transition-colors"
                    >
                      <img
                        src={imgUrl}
                        alt={`Existing image ${i + 1}`}
                        className="w-6 h-6 object-cover rounded"
                      />
                      <span
                        className="text-white text-sm truncate flex-1"
                        title="Existing image"
                      >
                        Existing image
                      </span>
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imgUrl)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* new image files */}
            {formData.images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-300 mb-2">New images:</p>
                <div className="flex flex-wrap gap-2">
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
              onChange={(e) =>
                handleFieldChange("restricted", e.target.checked)
              }
              className="w-4 h-4"
            />
            <span className="text-white text-sm">
              This reagent is subject to strict regulations and requires special
              approval.
            </span>
          </label>
        }
      />

      <div className="flex justify-between pt-4 border-t border-muted">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting || dataSubmitting}
            className={`${buttonStyles} bg-gray-600 hover:bg-red-500`}
          >
            Cancel
          </button>
          {editMode && onDelete && (
            <button
              type="button"
              onClick={handleDeleteReagent}
              disabled={deleting || dataSubmitting}
              className={`${buttonStyles} ${
                deleteConfirmCooldown
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-red-600 hover:bg-red-700"
              } disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200`}
            >
              {deleting
                ? "Deleting..."
                : deleteConfirmCooldown
                  ? "Are you sure?"
                  : "Delete"}
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={dataSubmitting || deleting}
          className={`${buttonStyles} min-w-[120px] bg-blue-primary hover:bg-blue-primary/80 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {dataSubmitting
            ? editMode
              ? "Updating..."
              : "Submitting..."
            : editMode
              ? "Update Reagent"
              : "Create Reagent"}
        </button>
      </div>
    </form>
  )
}

export default ReagentForm
