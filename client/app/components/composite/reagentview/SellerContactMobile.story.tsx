import type { Meta, StoryObj } from "@storybook/nextjs"
import SellerContactMobile from "./SellerContactMobile"

const meta: Meta<typeof SellerContactMobile> = {
  title: "Example/SellerContactMobile",
  component: SellerContactMobile,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof SellerContactMobile>

export const DefaultSellerContact: Story = {
  args: {
    rating: 99,
    reagent: {
      id: "test-id",
      user_id: "user_1",
      name: "Test Reagent",
      description: "Test description",
      condition: "New",
      quantity: 1,
      unit: "g",
      expiryDate: "2025-12-31",
      tradingType: "trade",
      location: "University of Auckland",
      categories: ["chemical"],
      createdAt: "2025-01-01T00:00:00.000Z",
      createdAtReadable: "1st Jan 2025",
      restricted: false,
    },
  },
}
