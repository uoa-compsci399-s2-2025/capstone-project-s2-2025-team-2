import { ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  size?: "small" | "medium" | "large"
  label: string
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({
  backgroundColor,
  label,
  className,
  ...props
}: ButtonProps) => {
  // default blue bg when backgroundColours prop isn't specified
  const defaultColourClasses = "border-blue-primary hover:bg-blue-primary/25"

  // need to use inline styles for custom colours -- passing props to tailwind utility classes doesnt work
  const btnColours = {
    borderColor: backgroundColor,
    color: backgroundColor,
  }

  const finalClasses = backgroundColor
    ? "inline-block cursor-pointer border-2 rounded-[8px] font-sans hover:bg-opacity-25"
    : `inline-block cursor-pointer border-2 rounded-[8px] font-sans ${defaultColourClasses}`
  return (
    <button
      type="button"
      className={[finalClasses, className].join(" ")}
      style={{
        ...btnColours,
      }}
      onMouseEnter={(e) => {
        if (backgroundColor) {
          e.currentTarget.style.backgroundColor = `${backgroundColor}20`
        }
      }}
      onMouseLeave={(e) => {
        if (backgroundColor) {
          e.currentTarget.style.backgroundColor = "transparent"
        }
      }}
      {...props}
    >
      <h5
        className={backgroundColor ? "" : "text-blue-primary"}
        style={{ color: backgroundColor }}
      >
        {label}
      </h5>
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
