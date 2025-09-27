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
    name: "Violet Chen",
    location: "University of Auckland",
    rating: 99,
  },
}
