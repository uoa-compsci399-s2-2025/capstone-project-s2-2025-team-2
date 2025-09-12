import { ButtonHTMLAttributes } from "react"
import { getTextSizeClass } from "../textSize"
import { getFontWeightClass } from "../font-weight"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  size?: "small" | "medium" | "large"
  label: string
  textSize?: "xsmall" | "small" | "medium" | "large"
  fontWeight?: "normal" | "medium" | "semibold" | "bold"
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({
  backgroundColor,
  label,
  className,
  textSize,
  fontWeight,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-block w-full cursor-pointer border-2 rounded-[8px] font-sans border-blue-primary hover:bg-blue-primary/25",
        className,
      ].join(" ")}
      {...props}
    >
      <h5
        className={[
          backgroundColor ? "" : "text-blue-primary",
          getTextSizeClass(textSize),
          getFontWeightClass(fontWeight),
        ].join(" ")}
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
