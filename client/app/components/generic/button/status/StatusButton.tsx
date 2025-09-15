import { ButtonHTMLAttributes } from "react"
import { getTextSizeClass, type textSize } from "../textSize"
import { getFontWeightClass } from "../font-weight"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  status: "success" | "error"
  textSize?: textSize
  fontWeight?: "normal" | "medium" | "semibold" | "bold"
  label: string
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({
  label,
  textSize = "text-base",
  fontWeight,
  ...props
}: ButtonProps) => {
  const { className, ...rest } = props

  return (
    <button
      type="button"
      className={[
        "py-2 px-2 inline-block cursor-pointer rounded-[8px] font-sans text-white",
        className,
      ].join(" ")}
      {...rest}
    >
      <h5
        className={[
          "text-white",
          getTextSizeClass(textSize),
          getFontWeightClass(fontWeight),
        ].join(" ")}
      >
        {label}
      </h5>
    </button>
  )
}

const SuccessButton = (props: ButtonProps) => (
  <BaseButton {...props} className="bg-success hover:bg-success/75" />
)
const ErrorButton = (props: ButtonProps) => (
  <BaseButton {...props} className="bg-warning hover:bg-warning/75" />
)

// exported btn component to be used
const StatusButton = ({ ...props }: ButtonProps) => {
  switch ({ ...props }.status) {
    case "success":
      return <SuccessButton {...props} />
    case "error":
      return <ErrorButton {...props} />
  }
}

export default StatusButton
