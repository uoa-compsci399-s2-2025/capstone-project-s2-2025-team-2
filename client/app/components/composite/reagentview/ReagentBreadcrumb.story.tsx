import type { Meta, StoryObj } from "@storybook/nextjs"
import ReagentBreadcrumb from "./ReagentBreadcrumb"

const meta = {
  title: "Example/ReagentBreadcrumb",
  component: ReagentBreadcrumb,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof ReagentBreadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultReagentBreadcrumb: Story = {
  args: {
    reagentName: "reagentName",
  },
}
