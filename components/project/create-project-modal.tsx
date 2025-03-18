"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { createProject } from "@/actions/projects";
import { useProjectContext } from "@/providers/projects";
import { useBusinessFunctionContext } from "@/providers/bussiness-function";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessFunctionId: string | null;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  businessFunctionId,
}: CreateProjectModalProps) {
  const [open, setOpen] = useState(isOpen);
  const [file, setFile] = useState<File | null>(null);
  const [state, formAction, status] = useActionState(createProject, {
    status: "",
  } as any);
  const { refetch, functionId } = useProjectContext();
  const { refetch: refetchFunctions } = useBusinessFunctionContext();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) onClose();
  }, [open]);

  useEffect(() => {
    if (state && state.status === "success") {
      setOpen(false);
      refetch();
      refetchFunctions();
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[525px]">
        <form action={formAction}>
          <input
            type="hidden"
            name="functionId"
            value={functionId?.toString()}
          />
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
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
                rows={3}
                name="description"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="workInstructions" className="text-right pt-2">
                Work Instructions
              </Label>
              <Textarea
                id="workInstructions"
                name="workInstructions"
                className="col-span-3"
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
          </div>
          <div className="flex justify-end">
            <Button type="submit">Create Project</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
