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
    reagent: {
      user_id: "user123",
      name: "Hydrogen Peroxide 5%",
      createdAt: "25/09/2025",
      expiryDate: "25/09/2026",
      location: "University of Auckland",
      price: 30,
      quantity: 500,
      unit: "mL",
      description:
        "Selling a 500 mL bottle of hydrogen peroxide (H₂O₂) reagent, 5% solution. It's Sigma-Aldrich brand, still sealed and completely full. I originally bought it for a project but ended up not needing it, so it's brand new and has been stored properly in a cool, dark space since purchase. Expiry is 2026, so plenty of shelf life left. lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem",
      categories: ["chemical"],
      images: ["./placeholder.webp"],
      // Add any other required fields for ReagentWithId, e.g. id
      id: "1",
      condition: "new",
      tradingType: "sell",
    },
  },
}
