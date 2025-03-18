"use client";

import {
  Dispatch,
  SetStateAction,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { users } from "@/lib/data"; // Import users from your data file
import { useEpicContext } from "@/providers/epics";
import { createTask } from "@/actions/tasks";
import useFormErrors from "@/hooks/useFormError";
import FormMessage from "@/components/form/message";

interface CreateTaskFormProps {
  projectId: string;
  onTaskCreated: () => void;
}

const fields = [
  "name",
  "description",
  "epic",
  "status",
  "priority",
  "assignee",
];
type FieldValues = (typeof fields)[number];

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  projectId,
  onTaskCreated,
}) => {
  const [state, formAction] = useActionState(createTask, {} as any);
  const { setError, getFieldErrors, clearAllErrors, fieldHasErrors } =
    useFormErrors<FieldValues>(fields);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [epic, setEpic] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [priority, setPriority] = useState<string | undefined>(undefined);
  const [assignee, setAssignee] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (state && state.status === "success") {
      onTaskCreated();
    } else if (state.errors) {
      const keys = Object.keys(state.errors).filter((el) =>
        fields.includes(el)
      );

      clearAllErrors();

      for (const key of keys) {
        setError(key, state.errors[key]);
      }

      if (state.data.name) setName(state.data.name);
      if (state.data.description) setDescription(state.data.description);
      if (state.data.epic) setEpic(state.data.epic);
      if (state.data.status) setStatus(state.data.status);
      if (state.data.priority) setPriority(state.data.priority);
      if (state.data.assignee) setAssignee(state.data.name);
    }
  }, [state, projectId]);

  const { epics } = useEpicContext();

  return (
    <form action={formAction}>
      <div className="grid gap-4 py-4">
        <input type="hidden" name="projectId" value={projectId} />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="title"
            variant={fieldHasErrors("name") ? "error" : "default"}
            className="text-right"
          >
            Title
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Input
              id="title"
              name="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              hasError={fieldHasErrors("name")}
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
          <div className="flex flex-col gap-2  col-span-3">
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              hasError={fieldHasErrors("description")}
              rows={3}
            />
            {fieldHasErrors("description") && (
              <FormMessage message={getFieldErrors("description")[0]} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="epic"
            variant={fieldHasErrors("epic") ? "error" : "default"}
            className="text-right"
          >
            Epic
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Select value={epic} onValueChange={setEpic} name="epic">
              <SelectTrigger hasError={fieldHasErrors("epic")}>
                <SelectValue placeholder="Select Epic" />
              </SelectTrigger>
              <SelectContent>
                {epics?.map((el) => {
                  return (
                    <SelectItem key={el.id} value={el.id.toString()}>
                      {el.name}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {fieldHasErrors("epic") && (
              <FormMessage message={getFieldErrors("epic")[0]} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="status"
            variant={fieldHasErrors("status") ? "error" : "default"}
            className="text-right"
          >
            Status
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Select value={status} onValueChange={setStatus} name="status">
              <SelectTrigger hasError={fieldHasErrors("status")}>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="inProgress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            {fieldHasErrors("status") && (
              <FormMessage message={getFieldErrors("status")[0]} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="priority"
            variant={fieldHasErrors("priority") ? "error" : "default"}
            className="text-right"
          >
            Priority
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Select
              value={priority}
              onValueChange={setPriority}
              name="priority"
            >
              <SelectTrigger hasError={fieldHasErrors("priority")}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            {fieldHasErrors("priority") && (
              <FormMessage message={getFieldErrors("priority")[0]} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="assignee"
            variant={fieldHasErrors("assignee") ? "error" : "default"}
            className="text-right"
          >
            Assignee
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Select
              value={assignee}
              onValueChange={setAssignee}
              name="assignee"
            >
              <SelectTrigger hasError={fieldHasErrors("assignee")}>
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fieldHasErrors("assignee") && (
              <FormMessage message={getFieldErrors("assignee")[0]} />
            )}
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="dueDate"
            variant={fieldHasErrors("dueDate") ? "error" : "default"}
            className="text-right"
          >
            Due Date
          </Label>
          <div className="flex flex-col gap-2 col-span-3">
            <Input
              id="dueDate"
              name="dueDate"
              hasError={fieldHasErrors("dueDate")}
              type="date"
            />
            {fieldHasErrors("dueDate") && (
              <FormMessage message={getFieldErrors("dueDate")[0]} />
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button type="submit">Create task</Button>
      </DialogFooter>
    </form>
  );
};

export default CreateTaskForm;
