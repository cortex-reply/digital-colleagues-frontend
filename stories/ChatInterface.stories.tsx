import type { Meta, StoryObj } from "@storybook/react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { projects } from "@/lib/data"

const meta: Meta<typeof ChatInterface> = {
  title: "Chat/ChatInterface",
  component: ChatInterface,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ChatInterface>

export const ProjectChat: Story = {
  args: {
    messages: projects[0].messages,
    contextType: "project",
    contextId: projects[0].id,
  },
}

export const BusinessFunctionChat: Story = {
  args: {
    messages: projects[0].messages,
    contextType: "businessFunction",
    contextId: "bf1",
  },
}

