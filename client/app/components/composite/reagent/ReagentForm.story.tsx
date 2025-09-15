import type { Meta, StoryObj } from "@storybook/nextjs"
import ReagentForm from "./ReagentForm"

const meta = {
  title: "Composite/Reagent/ReagentForm",
  component: ReagentForm,
  parameters: {
    layout: "centered",
  },
  args: {
    onSubmit: (data) =>
      alert(`listing submitted: ${JSON.stringify(data, null, 2)}`),
    onCancel: () => alert("user pressed cancel"),
  },
} satisfies Meta<typeof ReagentForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
