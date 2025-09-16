import type { Meta, StoryObj } from "@storybook/nextjs"
import ReagentRequest from "./ReagentRequest"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Composite/Reagent/ReagentRequest",
  component: ReagentRequest,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: { type: "boolean" },
    },
    requesterName: {
      control: { type: "text" },
    },
    ownerName: {
      control: { type: "text" },
    },
  },

  args: {},
  decorators: [
    (Story) => (
      <div className="bg-primary min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReagentRequest>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultReagentRequest: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    onSubmit: () => {},
    reagent: {
      id: "reagent-123",
      user_id: "owner123",
      name: "Hydrochloric Acid",
      description: "High purity hydrochloric acid for laboratory use",
      condition: "Brand New",
      price: 10,
      quantity: 20,
      expiryDate: "2025-12-31",
      tradingType: "trade",
      images: [],
      categories: ["chemical"],
      createdAt: "2025-01-01",
      location: "UoA, Auckland",
    },
    requesterName: "Del",
    ownerName: "Kim",
  },
}
