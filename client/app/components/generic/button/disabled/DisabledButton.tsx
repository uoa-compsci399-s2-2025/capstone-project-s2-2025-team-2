import { ButtonHTMLAttributes } from "react"
import { getFontWeightClass } from "../font-weight"
import { getTextSizeClass, type textSize } from "../textSize"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  outlined?: boolean
  textSize?: textSize
  fontWeight?: "normal" | "medium" | "semibold" | "bold"
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({
  label,
  outlined = false,
  textSize = "text-base",
  fontWeight,
  ...props
}: ButtonProps) => {
  const { className, ...rest } = props

  return (
    <button
      type="button"
      className={[
        "py-2 px-2 inline-block rounded-[8px] font-sans bg-muted",
        className,
      ].join(" ")}
      {...rest}
    >
      <h5
        className={[
          "text-secondary",
          getTextSizeClass(textSize),
          getFontWeightClass(fontWeight),
        ].join(" ")}
      >
        {label}
      </h5>
    </button>
  )
}

const OutlinedButton = (props: ButtonProps) => (
  <BaseButton
    {...props}
    className={[
      "bg-transparent border-2 border-muted",
      { ...props }.className,
    ].join(" ")}
  />
)

// exported btn component to be used
const DisabledButton = ({ ...props }: ButtonProps) => {
  if ({ ...props }.outlined) {
    return <OutlinedButton {...props} />
  } else {
    return <BaseButton {...props} />
  }
}

export default DisabledButton
