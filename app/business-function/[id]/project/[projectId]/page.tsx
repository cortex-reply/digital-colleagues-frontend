import { ProjectView } from "@/components/project/project-view"
import { Shell } from "@/components/shell"
import { getProjectById } from "@/lib/data"

export default function ProjectPage({ params }: { params: { id: string; projectId: string } }) {
  const project = getProjectById(params.projectId)

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <Shell>
      <ProjectView project={project} />
    </Shell>
  )
}

