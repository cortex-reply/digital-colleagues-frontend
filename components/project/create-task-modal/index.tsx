"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { Project } from "@/payload-types";
import CreateTaskForm from "./create-task-form";
import CreateEpicForm from "./create-epic-form";

interface CreateTaskModalProps {
  isOpen: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  project: Project;
  onTaskCreated: () => void | Promise<void>;
  onEpicCreated: () => void | Promise<void>;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onOpenChange,
  project,
  onEpicCreated,
  onTaskCreated,
}) => {
  const [type, setType] = useState<"epic" | "task">("task");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] ">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>
            <div className="flex items-center gap-2">
              <span>Create</span>

              <Select
                name="type"
                value={type}
                onValueChange={(value) => setType(value as "epic" | "task")}
              >
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Task</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  {/* <SelectItem value="story">Story</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </DialogTitle>
          <DialogDescription>
            Add a new {type === "task" ? "task" : "epic"} to this project
          </DialogDescription>
        </DialogHeader>
        {type === "task" ? (
          <CreateTaskForm
            projectId={project.id.toString()}
            onTaskCreated={onTaskCreated}
          />
        ) : (
          <CreateEpicForm
            projectId={project.id.toString()}
            onEpicCreated={onEpicCreated}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskModal;
