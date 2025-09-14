import type { Meta, StoryObj } from "@storybook/nextjs"
import SellerContact from "./SellerContact"

const meta = {
  title: "Example/SellerContact",
  component: SellerContact,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof SellerContact>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSellerContact: Story = {
  args: {
    name: "Violet Chen",
    location: "University of Auckland",
    rating: 99,
  },
}
