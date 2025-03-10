import type { Meta, StoryObj } from "@storybook/react"
import { BusinessFunctionView } from "@/components/business-function/business-function-view"
import { businessFunctions } from "@/lib/data"

const meta: Meta<typeof BusinessFunctionView> = {
  title: "Business Function/BusinessFunctionView",
  component: BusinessFunctionView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof BusinessFunctionView>

export const Default: Story = {
  args: {
    businessFunction: businessFunctions[0],
  },
}

