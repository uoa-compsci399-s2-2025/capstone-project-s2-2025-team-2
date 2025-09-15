import { ButtonHTMLAttributes } from "react"
import { getFontWeightClass } from "../font-weight"
import { getTextSizeClass, type textSize } from "../textSize"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  label: string
  textSize?: textSize
  fontWeight?: "normal" | "medium" | "semibold" | "bold"
}

// base button component w/ common styling/functionality across all variants
const OutlinedButton = ({
  backgroundColor,
  label,
  className,
  textSize = "text-base",
  fontWeight,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "py-2 px-2 inline-block cursor-pointer border-2 rounded-[8px] font-sans border-blue-primary",
        className,
      ].join(" ")}
      style={{
        borderColor: backgroundColor,
      }}
      {...props}
    >
      <h5
        className={[
          getTextSizeClass(textSize),
          backgroundColor ? "" : "text-blue-primary",
          getFontWeightClass(fontWeight),
        ].join(" ")}
        style={{ color: backgroundColor }}
      >
        {label}
      </h5>
    </button>
  )
}
export default OutlinedButton
