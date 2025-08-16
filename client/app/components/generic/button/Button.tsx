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
        "inline-block cursor-pointer border-0 rounded-[8px] bg-blue-primary text-white",
        className,
      ].join(" ")}
      {...props}
    >
      {label}
    </button>
  )
}

// btn variants
const SmallButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-2.5 px-4 text-xs" />
)

const MediumButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-3 px-5 text-sm" />
)

const LargeButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-3.5 px-6 text-base" />
)

// exported btn component to be used
const Button = ({ size = "medium", ...props }: ButtonProps) => {
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

export default Button
