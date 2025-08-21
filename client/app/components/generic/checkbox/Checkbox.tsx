import { InputHTMLAttributes } from "react"

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  state?: "checked" | "unchecked" | "disabled"
  label?: string
}

const CheckboxBase = ({ label, className, ...props }: CheckboxProps) => {
  return (
    <label className="inline-flex items-center cursor-pointer gap-2">
      <input
        type="checkbox"
        className={[
          "appearance-none h-5 w-5 rounded-md border border-gray-400 transition-colors duration-200",
          className,
        ].join(" ")}
        {...props}
      />
      {label && <h5>{label}</h5>}
    </label>
  )
}

const Checked = (props: CheckboxProps) => (
  <CheckboxBase {...props} checked className="bg-cyan-70" />
)

const Unchecked = (props: CheckboxProps) => (
  <CheckboxBase {...props} checked className="bg-white" />
)

const Disabled = (props: CheckboxProps) => (
  <CheckboxBase {...props} checked className="bg-secondary" />
)

const Checkbox = ({ state = "unchecked", ...props }: CheckboxProps) => {
  switch (state) {
    case "checked":
      return <Checked {...props} />
    case "unchecked":
      return <Unchecked {...props} />
    case "disabled":
      return <Disabled {...props} />
    default:
      return <Unchecked {...props} />
  }
}

export default Checkbox
