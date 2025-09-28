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
const BaseButton = ({
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
        "py-2 px-2 inline-flex gap-2 cursor-pointer border-0 rounded-[8px] bg-blue-primary text-white",
        className,
      ].join(" ")}
      style={{
        backgroundColor: backgroundColor,
      }}
      {...props}
    >
      {props.icon && iconPosition === "left" && (
        <props.icon className={getIconSizeClass(textSize)} />
      )}
      <h5
        className={[
          getTextSizeClass(textSize),
          getFontWeightClass(fontWeight),
        ].join(" ")}
      >
        {label}
      </h5>
      {props.icon && iconPosition === "right" && (
        <props.icon className={getIconSizeClass(textSize)} />
      )}
    </button>
  )
}

// exported btn component to be used
const Button = ({ ...props }: ButtonProps) => {
  return <BaseButton {...props} />
}

export default Button
