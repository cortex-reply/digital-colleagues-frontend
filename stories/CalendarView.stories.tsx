import type { Meta, StoryObj } from "@storybook/react"
import { CalendarView } from "@/components/project/calendar-view"
import { projects } from "@/lib/data"

const meta: Meta<typeof CalendarView> = {
  title: "Project/CalendarView",
  component: CalendarView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof CalendarView>

export const Default: Story = {
  args: {
    tasks: projects[0].tasks,
  },
}

