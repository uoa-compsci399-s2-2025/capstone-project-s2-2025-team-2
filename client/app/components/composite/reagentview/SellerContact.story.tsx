import type { Meta, StoryObj } from "@storybook/nextjs"
import SellerContact from "./SellerContact"

const meta: Meta<typeof SellerContact> = {
  title: "Example/SellerContact",
  component: SellerContact,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
}

export default meta

type Story = StoryObj<typeof SellerContact>

export const DefaultSellerContact: Story = {
  args: {
    rating: 99,
  },
}
