import { ButtonHTMLAttributes } from "react"
import { getTextSizeClass } from "../textSize"
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  size?: "small" | "medium" | "large"
  label: string
  textSize?: "small" | "medium" | "large"
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({
  label,
  className,
  textSize,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-block w-full cursor-pointer border-0 rounded-[8px] font-sans bg-blue-primary text-white hover:bg-blue-primary/75",
        className,
      ].join(" ")}
      {...props}
    >
      <h5 className={getTextSizeClass(textSize)}>{label}</h5>
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
