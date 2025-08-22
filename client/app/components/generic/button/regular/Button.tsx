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
  const defaultColourClasses = "bg-blue-primary hover:bg-blue-primary/75"

  // need to use inline styles for custom colours -- passing props to tailwind utility classes doesnt work
  const btnColours = {
    backgroundColor: backgroundColor,
  }

  const finalClasses = backgroundColor
    ? "inline-block cursor-pointer border-0 rounded-[8px] font-sans hover:bg-opacity-75"
    : `inline-block cursor-pointer border-0 rounded-[8px] font-sans ${defaultColourClasses}`

  return (
    <button
      type="button"
      className={[finalClasses, className].join(" ")}
      style={{
        ...btnColours,
      }}
      {...props}
    >
      <h5>{label}</h5>
    </button>
  )
}

// btn variants
const SmallButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={["py-1.5 px-3", { ...props }.className].join(" ")}
  />
)

const MediumButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={["py-3 px-5", { ...props }.className].join(" ")}
  />
)

const LargeButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={["py-4.5 px-7", { ...props }.className].join(" ")}
  />
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
