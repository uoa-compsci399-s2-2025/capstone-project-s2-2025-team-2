"use client"

import Button from "../../components/generic/button/regular/Button"
import DisabledButton from "../../components/generic/button/disabled/DisabledButton"
import AuthInputBox from "../../components/auth/AuthInputBox"
import AuthText from "../../components/auth/AuthText"
import AuthLink from "../../components/auth/AuthLink"
import { useState, useEffect } from "react"

interface SignUpPersonalSectionProps {
  displayName: string
  university: string
  onDisplayNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onUniversityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onNextStep: () => void
  onSignInClick: () => void
}

// New Zealand Universities list
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

//            function: SignUpPersonalSection           //
export default function SignUpPersonalSection({
  displayName,
  university,
  onDisplayNameChange,
  onUniversityChange,
  onNextStep,
  onSignInClick,
}: SignUpPersonalSectionProps) {
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    setIsFormValid(displayName.trim().length > 0 && university.length > 0)
  }, [displayName, university])

  //            render: SignUpPersonalSection           //
  return (
    <div className="flex flex-col flex-1 justify-between">
      <div className="space-y-4">
        <AuthInputBox
          id="displayName"
          name="displayName"
          type="text"
          label="Display Name"
          placeholder="Enter your display name"
          value={displayName}
          onChange={onDisplayNameChange}
          required
        />

        <div>
          <label
            htmlFor="university"
            className="block text-sm font-medium text-white"
          >
            University
          </label>
          <select
            id="university"
            name="university"
            value={university}
            onChange={onUniversityChange}
            className="mt-1 block w-full px-3 py-2 border border-muted rounded-md shadow-sm placeholder-secondary bg-primary text-white focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-blue-primary transition-colors"
            required
          >
            <option value="">Select your university</option>
            {NEW_ZEALAND_UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni} className="bg-primary text-white">
                {uni}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-auto space-y-6">
        {/* Next Step Button */}
        <div className="flex justify-center w-full">
          {!isFormValid ? (
            <DisabledButton
              label="Next Page"
              textSize="text-sm"
              className="justify-center w-full"
            />
          ) : (
            <Button
              type="button"
              label="Next Page"
              textSize="text-sm"
              onClick={onNextStep}
              className="justify-center w-full"
            />
          )}
        </div>

        {/* Sign In Link */}
        <AuthText className="text-center">
          Already have an account?{" "}
          <AuthLink onClick={onSignInClick}>Sign in</AuthLink>
        </AuthText>
      </div>
    </div>
  )
}
