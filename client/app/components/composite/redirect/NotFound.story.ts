import type { Meta, StoryObj } from "@storybook/nextjs"
import NotFound from "./NotFound"

const meta = {
  title: "Composite/NotFound",
  component: NotFound,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof NotFound>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultNotFound: Story = {
  args: {},
}
