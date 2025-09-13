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
  },
}