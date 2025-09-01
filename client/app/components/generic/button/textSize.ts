export const getTextSizeClass = (size?: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return "text-sm"
    case "medium":
      return "text-base"
    case "large":
      return "text-lg"
    default:
      return "text-lg"
  }
}
