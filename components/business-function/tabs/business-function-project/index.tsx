import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Project } from "@/payload-types";
import { useProjectContext } from "@/providers/projects";
import { Calendar, ChevronRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import BusinessFunctionProjectCard from "./project-card";

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
      {projects.map((project) => {
        return (
          <BusinessFunctionProjectCard
            key={project.id}
            functionId={functionId.toString()}
            projectId={project.id.toString()}
          />
        );
      })}
    </div>
  );
};

export default BusinessFunctionProjects;
