export const getTextSizeClass = (
  size?: "xsmall" | "small" | "medium" | "large",
) => {
  switch (size) {
    case "xsmall":
      return "text-[0.8rem]"
    case "small":
      return "text-[0.9rem]"
    case "medium":
      return "text-base"
    case "large":
      return "text-lg"
    default:
      return "text-lg"
  }
}
