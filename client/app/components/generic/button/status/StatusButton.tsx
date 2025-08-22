import { ButtonHTMLAttributes } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "small" | "medium" | "large" | "success" | "error"
  label: string
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({ label, className, ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-block cursor-pointer border-0 rounded-[8px] font-sans text-white",
        className,
      ].join(" ")}
      {...props}
    >
      <h5>{label}</h5>
    </button>
  )
}

const SuccessButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-3 px-5 bg-success hover:bg-success/75" />
)
const ErrorButton = (props: ButtonProps) => (
  <BaseButton {...props} className="py-3 px-5 bg-warning hover:bg-warning/75" />
)

// exported btn component to be used
const StatusButton = ({ size = "medium", ...props }: ButtonProps) => {
  switch (size) {
    case "success":
      return <SuccessButton {...props} />
    case "error":
      return <ErrorButton {...props} />
  }
}

export default StatusButton
