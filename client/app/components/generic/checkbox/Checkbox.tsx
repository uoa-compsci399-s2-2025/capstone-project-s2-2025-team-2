import { InputHTMLAttributes } from "react"
import { useState } from "react"

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onClick"> {
  state?: "checked" | "unchecked" | "disabled"
  onClick?: (check: boolean) => void
}

const CheckboxBase = ({
  className,
  onClick,
  state,
  ...inputProps
}: CheckboxProps) => {
  return (
    <input
      type="checkbox"
      className={[
        "appearance-none h-5 w-5 cursor-pointer rounded-md border border-muted transition-colors duration-200",
        className,
      ].join(" ")}
      {...inputProps}
    />
  )
}
const Checkbox = ({
  state = "unchecked",
  onClick,
  ...props
}: CheckboxProps) => {
  const [checked, setChecked] = useState(state === "checked")

  if (state === "disabled") {
    return <CheckboxBase {...props} disabled />
  }

  return (
    <CheckboxBase
      {...props}
      checked={checked}
      onChange={() => {
        const next = !checked
        setChecked(next)
        onClick?.(next)
      }}
      className={
        checked
          ? "bg-blue-secondary border-blue-secondary"
          : "bg-white border-muted"
      }
    />
  )
}

export default Checkbox
