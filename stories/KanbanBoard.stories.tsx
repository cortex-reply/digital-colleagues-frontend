import type { Meta, StoryObj } from "@storybook/react"
import { KanbanBoard } from "@/components/project/kanban-board"
import { projects } from "@/lib/data"

const meta: Meta<typeof KanbanBoard> = {
  title: "Project/KanbanBoard",
  component: KanbanBoard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof KanbanBoard>

export const Default: Story = {
  args: {
    tasks: projects[0].tasks,
  },
}

