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
    "--tw-bg-opacity": "0.25",
    "--hover-bg-color": `${backgroundColor}40`, // 40 = 25% opacity in hex
  }

  const finalClasses = backgroundColor
    ? "inline-block cursor-pointer border-2 rounded-[8px] font-sans hover:bg-[var(--hover-bg-color)]"
    : `inline-block cursor-pointer border-2 rounded-[8px] font-sans ${defaultColourClasses}`

  return (
    <button
      type="button"
      className={[finalClasses, className].join(" ")}
      style={{
        ...btnColours,
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
