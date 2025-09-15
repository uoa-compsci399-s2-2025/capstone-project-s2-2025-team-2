export type textSize =
  | "text-xs"
  | "text-sm"
  | "text-base"
  | "text-lg"
  | "text-xl"
  | "text-2xl"
  | "text-3xl"
  | "text-4xl"

export const getTextSizeClass = (size?: textSize) => {
  switch (size) {
    case "text-xs":
      return "text-[0.75rem]"
    case "text-sm":
      return "text-[0.875rem]"
    case "text-base":
      return "text-[1rem]"
    case "text-lg":
      return "text-[1.125rem]"
    case "text-xl":
      return "text-[1.25rem]"
    case "text-2xl":
      return "text-[1.5rem]"
    case "text-3xl":
      return "text-[1.875rem]"
    case "text-4xl":
      return "text-[2.25rem]"
  }
}
