import type { Meta, StoryObj } from "@storybook/nextjs"
import ReagentCard from "./ReagentCard"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/ReagentCard",
  component: ReagentCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof ReagentCard>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultReagentCard: Story = {
  args: {
    name: "Ethanol",
    tags: ["liquid", "safe", "alchohol", "flammable"],
    location: "UoA, Auckland",
    expiryDate: "25/10/2026",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4R4SrdU7Rbyr3DqFDmKBsFH9t9lqjLcJetw&s",
    // quantity: "1L",
    formula: "C2H6O",
    description: "This is an example reagent",
  },
}
