import type { textSize } from "./textSize"

export const getIconSizeClass = (textSize?: textSize) => {
  switch (textSize) {
    case "text-xs":
      return "w-4"
    case "text-sm":
      return "w-5"
    case "text-base":
      return "w-6"
    case "text-lg":
      return "w-6"
    case "text-xl":
      return "w-7"
    case "text-2xl":
      return "w-7"
    case "text-3xl":
      return "w-10"
    case "text-4xl":
      return "w-11"
  }
}
