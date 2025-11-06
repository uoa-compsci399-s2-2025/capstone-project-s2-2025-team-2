import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import client from "../../../services/fetch-client"
import { uploadProfilePicture } from "../../../services/firebase-storage"

interface ProfileFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  userId: string
}

interface formData {
  displayName: string
  about: string
  university: string
  imageUrl?: string
}

const NEW_ZEALAND_UNIVERSITIES = [
  "University of Auckland",
  "Auckland University of Technology",
  "University of Waikato",
  "Massey University",
  "Victoria University of Wellington",
  "University of Canterbury",
  "Lincoln University",
  "University of Otago",
  "Other",
]

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
    displayName: "",
    about: "",
    university: "",
    imageUrl: "",
  })
  const [dataSubmitting, setDataSubmitting] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("")
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const idToken = localStorage.getItem("authToken")
        if (!idToken) {
          toast("Please sign in to edit profile.")
          onCancel()
          return
        }
        const { data: userData, error } = await client.GET(
          `/users/${userId}` as any,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          },
        )
        if (error) {
          throw new Error("Failed to fetch user data")
        }
        if (userData) {
          const userImage = userData.image || ""
          setOriginalImageUrl(userImage)
          setFormData({
            displayName: userData.displayName || "",
            about: userData.about || "",
            university: userData.university || "",
            imageUrl: userImage,
          })
        }
      } catch {
        toast.error("Failed to load profile data")
        onCancel()
      }
      setIsLoading(false)
    }
    fetchUserData()
  }, [userId, onCancel])

  const handleFieldChange = useCallback(
    <K extends keyof formData>(field: K, value: formData[K]) => {
      setFormData((current) => ({ ...current, [field]: value }))
    },
    [],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file")
        return
      }
      setSelectedFile(file)

      // Show preview
      const previewUrl = URL.createObjectURL(file)
      handleFieldChange("imageUrl", previewUrl)
    }
  }
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (dataSubmitting) return
    setDataSubmitting(true)

    // Name cant be empty
    if (formData.displayName.trim() === "") {
      toast("Name cannot be empty")
      setDataSubmitting(false)
      return
    }
    try {
      //fetch token from localStorage
      const idToken = localStorage.getItem("authToken")
      if (!idToken) {
        toast("Please sign in to edit profile.")
        setDataSubmitting(false)
        return
      }
      let finalImageUrl = formData.imageUrl
      if (selectedFile) {
        setImageUploading(true)
        toast("Uploading image...")
        try {
          const uploadedUrl = await uploadProfilePicture(userId, selectedFile)
          finalImageUrl = uploadedUrl === null ? undefined : uploadedUrl
          if (!finalImageUrl) {
            throw new Error("Image upload failed")
          }
        } catch (error) {
          console.error("Image upload failed:", error)
          toast.error("Failed to upload profile picture")
          setDataSubmitting(false)
          setImageUploading(false)
          return
        } finally {
          setImageUploading(false)
        }
      }

      const userData = {
        displayName: formData.displayName.trim(),
        about: formData.about.trim(),
        image: finalImageUrl?.trim() || "",
        university: formData.university.trim(),
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

      const updatedUser = updateUser as any
      toast.success("Profile updated successfully!")
      onSubmit(updatedUser)
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setDataSubmitting(false)
    }
  }

  // Show loading state while fetching user data
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-primary mx-auto mb-2"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="flex items-center justify-center gap-3 p-3 bg-primary/30 rounded-lg">
        <img
          src={formData.imageUrl || "/default_pfp.jpg"}
          alt="Profile Preview"
          className="h-[10rem] w-[10rem] rounded-full object-cover border-2 border-blue-primary"
          onError={(e) => {
            e.currentTarget.src = "/default_pfp.jpg"
            if (formData.imageUrl) {
              toast.error("Invalid image URL")
            }
          }}
        />
      </div>

      <div className="space-y-3">
        <div className="flex gap-3 justify-center">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={dataSubmitting || imageUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center px-6 py-2 bg-blue-primary text-white rounded-lg border-2 border-blue-primary hover:bg-blue-primary/80 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {selectedFile ? "Selected" : "Upload"}
            </label>
          </div>

          {formData.imageUrl && (
            <button
              type="button"
              onClick={() => {
                handleFieldChange("imageUrl", "")
                setSelectedFile(null)
              }}
              disabled={dataSubmitting || imageUploading}
              className="px-6 py-2 text-red-400 hover:text-red-300 border border-red-400 hover:border-red-300 rounded-lg disabled:opacity-50 transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        {/* Upload status */}
        {imageUploading && (
          <div className="flex items-center gap-2 text-blue-primary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-primary"></div>
            <span className="text-sm">Uploading image...</span>
          </div>
        )}

        {selectedFile && !imageUploading && (
          <div className="text-green-400 text-sm">
            ✓ File selected: {selectedFile.name} (will upload on save)
          </div>
        )}

        {!formData.imageUrl && !selectedFile && originalImageUrl && (
          <div className="text-orange-400 text-sm">
            ✓ Profile picture will be removed on save
          </div>
        )}
      </div>

      <FormField
        label="Display Name"
        required
        input={
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) => handleFieldChange("displayName", e.target.value)}
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
          <select
            value={formData.university}
            onChange={(e) =>
              handleFieldChange(
                "university",
                e.target.value
              )
            }
            className={inputStyles}
          >
            {NEW_ZEALAND_UNIVERSITIES.map((type) => (
              <option key={type} value={type} className="bg-primary">
                {type}
              </option>
            ))}
          </select>
        }
      />

      <div className="flex space-x-4">
        <button
          type="submit"
          className={`${buttonStyles} bg-blue-primary`}
          disabled={dataSubmitting || imageUploading}
        >
          {imageUploading
            ? "Uploading..."
            : dataSubmitting
              ? "Saving..."
              : "Save"}
        </button>
        <button
          type="button"
          className={`${buttonStyles} bg-muted`}
          onClick={onCancel}
          disabled={dataSubmitting || imageUploading}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
