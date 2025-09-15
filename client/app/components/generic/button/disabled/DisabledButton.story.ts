import type { Meta, StoryObj } from "@storybook/nextjs"

import { fn } from "storybook/test"

import DisabledButton from "./DisabledButton"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Disabled/Button",
  component: DisabledButton,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof DisabledButton>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SmallDisabledButton: Story = {
  args: {
    textSize: "text-sm",
    label: "I am a small button",
  },
}

export const MediumDisabledButton: Story = {
  args: {
    textSize: "text-base",
    label: "I am a medium button",
  },
}

export const LargeDisabledButton: Story = {
  args: {
    textSize: "text-xl",
    label: "Ray Zhao 🥵🥵🥵🥵",
  },
}

export const OutlinedDisabledButton: Story = {
  args: {
    outlined: true,
    label: "Ray Zhao 🥵🥵🥵🥵",
  },
}

export const DefaultDisabledButton: Story = {
  args: {
    label: "I don't have specified props",
  },
}
