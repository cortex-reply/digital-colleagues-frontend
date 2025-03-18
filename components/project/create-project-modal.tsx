"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
import useFormErrors from "@/hooks/useFormError";
import FormMessage from "../form/message";
import { cn } from "@/lib/utils";

const fields = ["name", "description", "workInstructions"];
type FieldValues = (typeof fields)[number];

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
  const [state, formAction] = useActionState(createProject, {
    status: "",
  } as any);
  const { refetch, functionId } = useProjectContext();
  const { refetch: refetchFunctions } = useBusinessFunctionContext();
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
  const workInstructionsInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!open) onClose();
  }, [open]);

  useEffect(() => {
    console.log("state", state);
    if (state && state.status === "success") {
      setOpen(false);
      refetch();
      refetchFunctions();
    } else if (state.errors) {
      const keys = Object.keys(state.errors).filter((el) =>
        fields.includes(el)
      );

      clearAllErrors();

      for (const key of keys) {
        setError(key, state.errors[key]);
      }

      if (state.data?.description && descriptionInputRef.current)
        descriptionInputRef.current.value = state.data.description;
      if (state.data?.name && nameInputRef.current)
        nameInputRef.current.value = state.data.name;
      if (state.data?.workInstructions && workInstructionsInputRef.current)
        workInstructionsInputRef.current.value = state.data.workInstructions;
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
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className={cn(
                  "text-right",
                  fieldHasErrors("name") && "text-red-500"
                )}
              >
                Name
              </Label>
              <div className="flex flex-col col-span-3">
                <Input
                  id="name"
                  name="name"
                  className={cn(
                    "flex-1",
                    fieldHasErrors("name") && "border-red-500"
                  )}
                  ref={nameInputRef}
                />
                {fieldHasErrors("name") && (
                  <FormMessage message={getFieldErrors("name")[0]} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="description"
                className={cn(
                  "text-right pt-2",
                  fieldHasErrors("description") && "text-red-500"
                )}
              >
                Description
              </Label>
              <div className="flex flex-col col-span-3">
                <Textarea
                  id="description"
                  className={cn(
                    fieldHasErrors("description") && "border-red-500"
                  )}
                  rows={3}
                  name="description"
                  ref={descriptionInputRef}
                />
                {fieldHasErrors("description") && (
                  <FormMessage message={getFieldErrors("description")[0]} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label
                htmlFor="workInstructions"
                className={cn(
                  "text-right pt-2",
                  fieldHasErrors("workInstructions") && "text-red-500"
                )}
              >
                Work Instructions
              </Label>
              <div className="flex flex-col col-span-3">
                <Textarea
                  id="workInstructions"
                  name="workInstructions"
                  rows={4}
                  className={cn(
                    fieldHasErrors("workInstructions") && "border-red-500"
                  )}
                  placeholder="Enter work instructions here"
                  ref={workInstructionsInputRef}
                />
                {fieldHasErrors("workInstructions") && (
                  <FormMessage
                    message={getFieldErrors("workInstructions")[0]}
                  />
                )}
              </div>
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
