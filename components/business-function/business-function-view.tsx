"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, Briefcase } from "lucide-react";
import { SearchInterface } from "@/components/search/search-interface";
import BusinessFunctionChat from "./tabs/business-function-chat";
import BusinessFunctionSquad from "./tabs/business-function-squad";
import { useProjectContext } from "@/providers/projects";
import { CreateProjectModal } from "../project/create-project-modal";
import { Function } from "@/payload-types";
import BusinessFunctionProjects from "./tabs/business-function-project";

export function BusinessFunctionView({
  businessFunction,
}: {
  businessFunction: Function;
}) {
  const [open, setOpen] = useState(false);
  const { projects } = useProjectContext();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {businessFunction.name}
            </h1>
            {businessFunction.description && (
              <p className="text-muted-foreground">
                {businessFunction.description}
              </p>
            )}
          </div>
        </div>
        <Button onClick={() => setOpen(true)}>
          <PlusCircle className="h-4 w-4" />
          Create Project
        </Button>
        <CreateProjectModal
          isOpen={open}
          businessFunctionId={businessFunction.id.toString()}
          onClose={() => {}}
        />
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="squad">Squad</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-4">
          <BusinessFunctionProjects
            functionId={businessFunction.id}
            projects={projects}
          />
        </TabsContent>
        <TabsContent value="chat">
          <BusinessFunctionChat />
        </TabsContent>
        <TabsContent value="squad">
          <BusinessFunctionSquad businessFunction={businessFunction} />
        </TabsContent>
        <TabsContent value="search">
          <SearchInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
}
