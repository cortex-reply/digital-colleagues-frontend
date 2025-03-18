"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createEpic } from "@/actions/epics";
import useFormErrors from "@/hooks/useFormError";
import FormMessage from "@/components/form/message";

interface CreateEpicFormProps {
  projectId: string;
  onEpicCreated: () => void;
}

const fields = ["name", "description"];
type FieldValues = (typeof fields)[number];

const CreateEpicForm: React.FC<CreateEpicFormProps> = ({
  projectId,
  onEpicCreated,
}) => {
  const [state, formAction] = useActionState(createEpic, {} as any);
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (state && state.status === "success") {
      onEpicCreated();
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
    }
  }, [state, projectId]);

  return (
    <form action={formAction}>
      <div className="grid gap-4 py-4">
        <input type="hidden" name="projectId" value={projectId} />

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="name"
            variant={fieldHasErrors("name") ? "error" : "default"}
            className="text-right"
          >
            Title
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Input
              id="name"
              name="name"
              hasError={fieldHasErrors("name")}
              ref={nameInputRef}
              className="col-span-3"
            />
            {fieldHasErrors("name") && (
              <FormMessage message={getFieldErrors("name")[0]} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label
            htmlFor="description"
            variant={fieldHasErrors("description") ? "error" : "default"}
            className="text-right pt-2"
          >
            Description
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Textarea
              id="description"
              name="description"
              hasError={fieldHasErrors("description")}
              ref={descriptionInputRef}
              rows={3}
            />
            {fieldHasErrors("description") && (
              <FormMessage message={getFieldErrors("description")[0]} />
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Create Epic</Button>
      </DialogFooter>
    </form>
  );
};

export default CreateEpicForm;
