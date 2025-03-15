"use client";

import { DialogFooter } from "@/components/ui/dialog";

import { useState, useEffect, useActionState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Briefcase, Upload } from "lucide-react";
import { SearchInterface } from "@/components/search/search-interface";
import type { BusinessFunction } from "@/lib/types";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createProject,
  getProjectsByBusinessFunctionId,
} from "@/actions/projects";
import { Project } from "@/payload-types";
import BusinessFunctionProjects from "./tabs/business-function-projects";
import BusinessFunctionChat from "./tabs/business-function-chat";
import BusinessFunctionSquad from "./tabs/business-function-squad";
import { useProjectContext } from "@/providers/projects";

export function BusinessFunctionView({
  businessFunction,
}: {
  businessFunction: BusinessFunction;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, status] = useActionState(createProject, {} as any);
  const [file, setFile] = useState<File | null>(null);
  const { refetch, projects } = useProjectContext();

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      refetch();
    }
  }, [state, businessFunction]);

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Add a new project to this business function
              </DialogDescription>
            </DialogHeader>
            <form action={formAction} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <input
                  type="hidden"
                  name="functionId"
                  value={businessFunction.id}
                />
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  name="description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="workInstructions" className="text-right pt-2">
                  Work Instructions
                </Label>
                <Textarea
                  id="workInstructions"
                  className="col-span-3"
                  name="workInstructions"
                  rows={4}
                  placeholder="Enter work instructions here"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">
                  Attachment
                </Label>
                <div className="col-span-3">
                  <Label
                    htmlFor="file"
                    className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-muted transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    {file ? file.name : "Upload file"}
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </div>
              </div>
              <Button type="submit">Create</Button>
            </form>
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
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
