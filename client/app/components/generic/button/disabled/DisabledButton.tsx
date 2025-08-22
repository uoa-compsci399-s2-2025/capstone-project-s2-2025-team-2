import { ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large" | "outline"
  label: string
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({ label, className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-block rounded-[8px] font-sans bg-muted",
        className,
      ].join(" ")}
      {...props}
    >
      <h5 className="text-secondary">{label}</h5>
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

const OutlinedButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className="py-4.5 px-7 bg-transparent border-2 border-muted"
  />
)

// exported btn component to be used
const DisabledButton = ({ size = "medium", ...props }: ButtonProps) => {
  switch (size) {
    case "small":
      return <SmallButton {...props} />
    case "medium":
      return <MediumButton {...props} />
    case "large":
      return <LargeButton {...props} />
    case "outline":
      return <OutlinedButton {...props} />
    default:
      return <MediumButton {...props} />
  }
}

export default DisabledButton
