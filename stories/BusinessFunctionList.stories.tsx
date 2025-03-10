import type { Meta, StoryObj } from "@storybook/react"
import { BusinessFunctionList } from "@/components/business-function/business-function-list"

const meta: Meta<typeof BusinessFunctionList> = {
  title: "Business Function/BusinessFunctionList",
  component: BusinessFunctionList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof BusinessFunctionList>

export const Default: Story = {}

