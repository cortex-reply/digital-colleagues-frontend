import { getProjectById } from "@/actions/projects";
import DateDisplay from "@/components/DateDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project, Task } from "@/payload-types";
import { Calendar, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";

interface BusinessFunctionProjectCardProps {
  projectId: string;
  functionId: string;
}

const BusinessFunctionProjectCard: React.FC<
  BusinessFunctionProjectCardProps
> = ({ projectId, functionId }) => {
  const [project, setProject] = useState<(Project & { tasks?: Task[] }) | null>(
    null
  );

  const fetchProject = useCallback(async (projectId: string) => {
    const res = await getProjectById(projectId);
    if (res.project) setProject(res.project);
  }, []);

  useEffect(() => {
    fetchProject(projectId);
  }, [projectId]);

  return (
    <>
      {project && (
        <Link
          key={project.id}
          href={`/business-function/${functionId}/project/${project.id}`}
          className="block"
        >
          <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>{project.name}</CardTitle>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription className="pt-1">
                {project.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.tasks?.length} tasks
                  </span>
                </div>
                {/* <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {project.messageCount} messages
                  </span>
                </div> */}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 pt-3">
              <div className="text-sm font-medium">
                Last updated: {DateDisplay(new Date(project.updatedAt))}
              </div>
            </CardFooter>
          </Card>
        </Link>
      )}
    </>
  );
};

export default BusinessFunctionProjectCard;
