import type { Meta, StoryObj } from "@storybook/nextjs"
import ReagentView from "./ReagentView"

const meta = {
  title: "Example/ReagentView",
  component: ReagentView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof ReagentView>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultReagentView: Story = {
  args: {
    name: "Hydrogen Peroxide 5%",
    listedDate: "25/09/2025",
    expiryDate: "25/09/2026",
    location: "University of Auckland",
    price: 30,
    category: "Chemical",
    condition: "New",
    quantity: "500ml",
    description:
      "Selling a 500 mL bottle of hydrogen peroxide (H₂O₂) reagent, 5% solution. It’s Sigma-Aldrich brand, still sealed and completely full.",
    tags: ["Tag 1", "Tag 2", "Tag 3"]
  },
}
