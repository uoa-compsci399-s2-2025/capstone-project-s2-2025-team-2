import type { Meta, StoryObj } from "@storybook/nextjs"
import WantedCard from "./WantedCard"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/WantedCard",
  component: WantedCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/marketplace",
      },
    },
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof WantedCard>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultWantedCard: Story = {
  args: {
    wanted: {
      id: "abcd",
      user_id: "user_1",
      name: "Ethanol",
      categories: ["chemical"],
      tradingType: "trade",
      description: "Does anyone have ethanol available for trade?",
      createdAt: "2025-01-01T00:00:00.000Z",
      location: "UoA, Auckland",
      createdAtReadable: "2025-01-01",
    },
  },
}
