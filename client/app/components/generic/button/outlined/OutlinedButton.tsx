import { ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  size?: "small" | "medium" | "large"
  label: string
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({ label, className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-block cursor-pointer border-2 rounded-[8px] font-sans border-blue-primary hover:bg-blue-primary/25",
        className,
      ].join(" ")}
      {...props}
    >
      <h5 className="text-blue-primary">{label}</h5>
    </button>
  )
}

// btn variants
const SmallButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-1.5 px-3" />
)

const MediumButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-3 px-5" />
)

const LargeButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-4.5 px-7" />
)

// exported btn component to be used
const OutlinedButton = ({ size = "medium", ...props }: ButtonProps) => {
  switch (size) {
    case "small":
      return <SmallButton {...props} />
    case "medium":
      return <MediumButton {...props} />
    case "large":
      return <LargeButton {...props} />
    default:
      return <MediumButton {...props} />
  }
}

export default OutlinedButton
