import type { Meta, StoryObj } from "@storybook/nextjs"
import OrderDetailsModal from "./OrderDetailsModal"

//story test data
const testOrder = {
  id: "order-123",
  requester_id: "userabcd123",
  reagent_id: "reagentabcd1",
  owner_id: "user2025123",
  status: "pending" as const,
  createdAt: "2025-01-01T00:00:00.000Z",
  message: "",
  quantity: 2,
  unit: "ml",
  offeredReagentId: "reagentabcd2", 
}

const testReagent = {
  id: "reagentabcd1",
  name: "Sodium Chloride",
  condition: "Used",
  expiryDate: "2025-12-31",
  location: "Lower Hutt, Wellington",
  quantity: 500,
  unit: "g",
  categories: ["chemical"] as ("chemical" | "hazardous" | "biological")[],
  tradingType: "trade" as const,
  user_id: "user2025123",
  price: 15.00,
  description: "High purity sodium chloride for lab use",
  createdAt: "2025-01-01T00:00:00.000Z",
  createdAtReadable: "January 1, 2025",
  images: [],
}

const testOfferedReagent = {
  id: "reagentabcd2",
  name: "Potassium Chloride",
  condition: "Brand New",
  expiryDate: "2026-06-30",
  location: "Waikato River, Hamilton",
  quantity: 250,
  unit: "g",
  categories: ["chemical"] as ("chemical" | "hazardous" | "biological")[],
  tradingType: "trade" as const,
  user_id: "userabcd123",
  price: 20.00,
  description: "Lab grade potassium chloride",
  createdAt: "2025-01-01T00:00:00.000Z",
  createdAtReadable: "January 1, 2025",
  images: [],
}

const meta = {
  title: "Composite/OrderDetailsModal",
  component: OrderDetailsModal,
  parameters: {
    layout: "centered",
  },
  args: {
    isOpen: true,
    onClose: () => alert("Closed Modal"),
    order: testOrder,
    reagent: testReagent,
  },
} satisfies Meta<typeof OrderDetailsModal>

export default meta

type Story = StoryObj<typeof meta>


//story for each request type
export const TradeRequest: Story = {
  args: {
    order: {
      ...testOrder,
      status: "pending" as const,
      offeredReagentId: "reagentabcd2",
      message: "I could really use this reagent for my research project. Please let me know if you're available to trade.",
    },
    reagent: {
      ...testReagent,
      tradingType: "trade" as const,
    },
    offeredReagent: testOfferedReagent,
  },
}

export const SellRequest: Story = {
  args: {
    order: {
      ...testOrder,
      status: "approved" as const,
      message: "I could really use this reagent for my research project. Please let me know if you're available to sell.",
    },
    reagent: {
      ...testReagent,
      tradingType: "sell" as const,
      price: 25.50,
    },
  },
}

export const GiveawayRequest: Story = {
  args: {
    order: {
      ...testOrder,
      status: "pending" as const,
      message: "I could really use this reagent for my research project. Please let me know if it is still available.",
    },
    reagent: {
      ...testReagent,
      tradingType: "giveaway" as const,
    },
  },
}
