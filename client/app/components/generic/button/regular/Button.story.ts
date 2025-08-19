import type { Meta, StoryObj } from "@storybook/nextjs"

import { fn } from "storybook/test"

import Button from "./Button"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/Regular/Button",
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const SmallButton: Story = {
  args: {
    size: "small",
    label: "I am a small button",
    backgroundColor: "#ff5555",
  },
}

export const MediumButton: Story = {
  args: {
    size: "medium",
    label: "I am a medium button",
    backgroundColor: "#ea49f2",
  },
}

export const LargeButton: Story = {
  args: {
    size: "large",
    label: "Ray Zhao 🥵🥵🥵🥵",
    backgroundColor: "#34ba32",
  },
}

export const DefaultButton: Story = {
  args: {
    label: "I don't have specified props",
  },
}
