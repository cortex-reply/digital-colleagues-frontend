import type { Meta, StoryObj } from "@storybook/react"
import { ProjectView } from "@/components/project/project-view"
import { projects } from "@/lib/data"

const meta: Meta<typeof ProjectView> = {
  title: "Project/ProjectView",
  component: ProjectView,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof ProjectView>

export const Default: Story = {
  args: {
    project: projects[0],
  },
}

