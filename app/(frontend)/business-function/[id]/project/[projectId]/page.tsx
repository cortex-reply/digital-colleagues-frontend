import { getProjectById } from "@/actions/projects";
import { ProjectView } from "@/components/project/project-view";
import { Shell } from "@/components/shell";

export default async function ProjectPage({
  params,
}: {
  params: { id: string; projectId: string };
}) {
  const par = await params;
  const { project } = await getProjectById(par.projectId);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <Shell>
      <ProjectView
        project={{
          businessFunctionId: "bf1",
          taskCount: 10,
          messageCount: 24,
          lastUpdated: "2023-06-15",
          messages: [],
          events: [],
          comments: [],
          ...project,
        }}
      />
    </Shell>
  );
}
