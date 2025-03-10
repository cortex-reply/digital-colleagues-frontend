import type { Meta, StoryObj } from "@storybook/react"
import { TeamMembersList } from "@/components/team/team-members-list"
import { businessFunctions } from "@/lib/data"

const meta: Meta<typeof TeamMembersList> = {
  title: "Team/TeamMembersList",
  component: TeamMembersList,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof TeamMembersList>

export const Default: Story = {
  args: {
    members: businessFunctions[0].members,
  },
}

