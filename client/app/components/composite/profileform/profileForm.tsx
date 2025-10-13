import { useCallback, useState } from "react"
import { toast } from "sonner"
import client from "../../../services/fetch-client"

interface ProfileFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  userId: string
}

interface formData {
  lastName: string
  preferredName: string
  about: string
  university: string
  imageUrl?: string
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

export const ProfileForm = ({
  onSubmit,
  onCancel,
  userId,
}: ProfileFormProps) => {
  const [formData, setFormData] = useState<formData>({
    lastName: "",
    preferredName: "",
    about: "",
    university: "",
    imageUrl: "",
  })
  const [dataSubmitting, setDataSubmitting] = useState(false)

  const handleFieldChange = useCallback(
    <K extends keyof formData>(field: K, value: formData[K]) => {
      setFormData((current) => ({ ...current, [field]: value }))
    },
    [],
  )
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (dataSubmitting) return
    setDataSubmitting(true)

    // First name cant be empty
    if (formData.preferredName.trim() === "") {
      alert("First name cannot be empty")
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

      const userData = {
        lastName: formData.lastName.trim(),
        preferredName: formData.preferredName.trim(),
        about: formData.about.trim(),
        university: formData.university.trim(),
        image: formData.imageUrl?.trim() || undefined,
      }

      const { data: updateUser, error } = await client.PATCH(
        `/users/${userId}` as any,
        {
          body: userData,
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      )

      if (error) {
        throw new Error("Failed to update profile")
      }

      let updatedUser = updateUser as any
      onSubmit(updatedUser)
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setDataSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <FormField
        label="Last Name"
        input={
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleFieldChange("lastName", e.target.value)}
            className={inputStyles}
          />
        }
      />
      <FormField
        label="First Name"
        required
        input={
          <input
            type="text"
            value={formData.preferredName}
            onChange={(e) => handleFieldChange("preferredName", e.target.value)}
            className={inputStyles}
          />
        }
      />
      <FormField
        label="About"
        input={
          <textarea
            value={formData.about}
            onChange={(e) => handleFieldChange("about", e.target.value)}
            className={inputStyles}
          />
        }
      />
      <FormField
        label="University"
        input={
          <input
            type="text"
            value={formData.university}
            onChange={(e) => handleFieldChange("university", e.target.value)}
            className={inputStyles}
          />
        }
      />
      <FormField
        label="Image URL"
        input={
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL here"
              value={formData.imageUrl || ""}
              onChange={(e) => handleFieldChange("imageUrl", e.target.value)}
              className={inputStyles}
            />
          </div>
        }
        className=""
      />
      {formData.imageUrl && (
        <div className="flex items-center mt-2">
          <img
            src={formData.imageUrl}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover"
          />
          <button
            type="button"
            onClick={() => handleFieldChange("imageUrl", "")}
            className="text-red-400 hover:text-red-300 text-sm ml-2"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex space-x-4">
        <button
          type="submit"
          className={`${buttonStyles} bg-blue-primary`}
          disabled={dataSubmitting}
        >
          {dataSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className={`${buttonStyles} bg-muted`}
          onClick={onCancel}
          disabled={dataSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
