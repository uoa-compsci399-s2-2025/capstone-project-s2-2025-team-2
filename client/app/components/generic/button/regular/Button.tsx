import { ButtonHTMLAttributes } from "react"
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  backgroundColor?: string
  size?: "small" | "medium" | "large"
  label: string
  icon?: React.ElementType;
  iconPosition?: "left" | "right"
}

// base button component w/ common styling/functionality across all variants
const BaseButton = ({ label, className, iconPosition = "left", ...props }: ButtonProps) => {
  return (
    <button
      type="button"
      className={[
        "inline-flex w-full cursor-pointer border-0 rounded-[8px] bg-blue-primary text-white hover:bg-blue-primary/75",
        className,
      ].join(" ")}
      {...props}
    >
      {props.icon && iconPosition === "left" && <props.icon className="w-5.5" />}
      <h5>{label}</h5>
      {props.icon && iconPosition === "right" && <props.icon className="w-5.5" />}
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