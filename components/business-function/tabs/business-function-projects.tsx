import { getProjects } from "@/actions/tasks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/payload-types";
import { Calendar, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

interface BusinessFunctionProjectsProps {
  functionId: string | number;
  projects: Project[];
}

const BusinessFunctionProjects: React.FC<BusinessFunctionProjectsProps> = ({
  functionId,
  projects,
}) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
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
                    {/* {project.taskCount} tasks */}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {/* {project.messageCount} messages */}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/50 pt-3">
              <div className="text-sm font-medium">
                {/* Last updated: {project.lastUpdated} */}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BusinessFunctionProjects;
