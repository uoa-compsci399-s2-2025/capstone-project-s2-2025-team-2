export const getFontWeightClass = (
  weight?: "normal" | "medium" | "semibold" | "bold",
) => {
  switch (weight) {
    case "normal":
      return "font-normal"
    case "medium":
      return "font-medium"
    case "semibold":
      return "font-semibold"
    case "bold":
      return "font-bold"
    default:
      return "font-medium"
  }
}
