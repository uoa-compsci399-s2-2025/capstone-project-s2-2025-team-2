import type { Meta, StoryObj } from "@storybook/nextjs"
import SearchBar from "./SearchBar"

const meta = {
  title: "Example/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    search: { control: "text" },
    filter: {
      control: "select",
      options: ["all", "category", "date", "tag"],
    },
    sort: {
      control: "select",
      options: ["", "earliestExpiry", "latestExpiry", "nameAZ", "nameZA"],
    },
  },
  args: {
    search: "",
    setSearch: (val: string) => console.log("setSearch", val),
    filter: "all",
    setFilter: (val: string) => console.log("setFilter", val),
    sort: "earliestExpiry",
    setSort: (
      val: "earliestExpiry" | "latestExpiry" | "nameAZ" | "nameZA" | "",
    ) => console.log("setSort", val),
  },
} satisfies Meta<typeof SearchBar>

export default meta
type Story = StoryObj<typeof meta>

export const DefaultSearchBar: Story = {
  args: {
    search: "ethanol",
    filter: "category",
    sort: "nameAZ",
  },
}
