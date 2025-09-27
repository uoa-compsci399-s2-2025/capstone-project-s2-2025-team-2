import { ButtonHTMLAttributes } from "react"
import { getFontWeightClass } from "../font-weight"
import { getTextSizeClass, type textSize } from "../textSize"
import { getIconSizeClass } from "../iconSize"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  label: string
  textSize?: textSize
  fontWeight?: "normal" | "medium" | "semibold" | "bold"
  icon?: React.ElementType
  iconPosition?: "left" | "right"
}

// base button component w/ common styling/functionality across all variants
const OutlinedButton = ({
  backgroundColor,
  label,
  className,
  iconPosition = "left",
  textSize = "text-base",
  fontWeight,
  ...props
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "py-2 px-2 inline-flex gap-2 cursor-pointer outline-2 rounded-[8px] outline-blue-primary",
        className,
      ].join(" ")}
      style={{
        outlineColor: backgroundColor,
      }}
      {...props}
    >
      {props.icon && iconPosition === "left" && (
        <props.icon
          className={getIconSizeClass(textSize)}
          style={{ color: backgroundColor }}
        />
      )}
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
      {props.icon && iconPosition === "right" && (
        <props.icon
          className={getIconSizeClass(textSize)}
          style={{ color: backgroundColor }}
        />
      )}
    </button>
  )
}
export default OutlinedButton
