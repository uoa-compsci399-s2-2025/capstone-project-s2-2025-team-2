import type { Meta, StoryObj } from "@storybook/nextjs"
import RecordCard from "./RecordCard"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "History/RecordCard",
  component: RecordCard,
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
} satisfies Meta<typeof RecordCard>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultRecordCard: Story = {
  args: {
    reagentName: "Sample Reagent",
    orderId: "123456",
    status: "Canceled",
    createdAt: "2024-06-01",
    offeredReagentId: "111",
    price: 69,
    requesterName: "kayn",
    ownerName: "zed",
    reagentId: "987654",
  },
}
