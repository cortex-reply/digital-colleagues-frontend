"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle,
  Link2,
  Paperclip,
  Plus,
} from "lucide-react";
import type { User, Comment } from "@/lib/types";
import { Task } from "@/payload-types";
import { updateTaskInfo } from "@/actions/tasks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";

interface TaskModalProps {
  task: Task;
  users: User[];
  // comments: Comment[];
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  // onAddComment: (comment: Omit<Comment, "id" | "timestamp">) => void;
}

export function TaskModal({
  task,
  users,
  // comments,
  isOpen,
  onClose,
  onUpdate,
  // onAddComment,
}: TaskModalProps) {
  const [editedTask, setEditedTask] = useState(task);
  const [newComment, setNewComment] = useState("");
  const [editingField, setEditingField] = useState<string | null>(null);

  const handleInputChange = (field: keyof Task, value: string) => {
    setEditedTask({ ...editedTask, [field]: value });
  };

  const handleUpdate = async (field: keyof Task) => {
    const updatableTasks = ["name", "description", "status", "closureDate"];
    if (updatableTasks.includes(field)) {
      await updateTaskInfo(task.id, { [field]: editedTask[field] });
    }
    onUpdate(editedTask);
    setEditingField(null);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // onAddComment({
      //   content: newComment,
      //   user: users[0], // Assuming the first user is the current user
      //   taskId: task.id.toString(),
      //   taskTitle: task.name || "",
      // });
      setNewComment("");
    }
  };

  const renderField = (
    field: keyof Task,
    label: string,
    type: "text" | "textarea" | "date" | "select",
    options?: { value: string; label: string }[]
  ) => {
    const isEditing = editingField === field;

    if (isEditing) {
      if (type === "select" && options) {
        return (
          <div className="flex items-center gap-2">
            <Select
              value={editedTask[field] as string}
              onValueChange={(value) => handleInputChange(field, value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => handleUpdate(field)}>
              Save
            </Button>
          </div>
        );
      }

      return (
        <div className="flex items-start gap-2">
          {type === "textarea" ? (
            <Textarea
              value={editedTask[field] as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="flex-1"
            />
          ) : type === "date" ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    editedTask[field] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon />
                  {editedTask[field] ? (
                    format(editedTask[field] as string, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={editedTask[field] as unknown as Date}
                  onSelect={(e) =>
                    handleInputChange(field, e?.toLocaleString("en") || "")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          ) : (
            <Input
              type={type}
              value={editedTask[field] as string}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="flex-1 border"
            />
          )}
          <Button size="sm" onClick={() => handleUpdate(field)}>
            Save
          </Button>
        </div>
      );
    }

    return (
      <div
        className="cursor-pointer hover:bg-muted/50 rounded-md p-1 -m-1"
        onClick={() => setEditingField(field)}
      >
        {typeof editedTask[field] === "string" &&
          editedTask[field] &&
          editedTask[field]}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader className="hidden">
          <DialogTitle>{task.name}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto px-2">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Title */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Title
                </div>
                {renderField("name", "Title", "text")}
              </div>

              {/* Description */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Description
                </div>
                {renderField("description", "Description", "textarea")}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Paperclip className="h-4 w-4" />
                  Attach
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add subtask
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Link2 className="h-4 w-4" />
                  Link issue
                </Button>
              </div>

              {/* Comments */}
              {/* <div className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Comments
                </div>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-4"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={comment.user.avatar}
                          alt={comment.user.name}
                        />
                        <AvatarFallback>
                          {comment.user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">
                          {comment.user.name}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-4">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={users[0].avatar} alt={users[0].name} />
                    <AvatarFallback>
                      {users[0].name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleAddComment}>Comment</Button>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                {renderField("status", "Status", "select", [
                  { value: "backlog", label: "Backlog" },
                  { value: "todo", label: "To Do" },
                  { value: "inProgress", label: "In Progress" },
                  // { value: "review", label: "Review" },
                  { value: "done", label: "Done" },
                ])}
              </div>

              {/* Blocked Status */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                {false ? (
                  // {editedTask.isBlocked ? (
                  <Badge
                    variant="destructive"
                    className="flex items-center gap-1"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Blocked by{" "}
                    <span className="ml-1 text-primary-foreground underline">
                      {editedTask.status}
                    </span>
                  </Badge>
                ) : (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Ready
                  </Badge>
                )}
              </div>

              {/* Assignee */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Assignee
                </div>
                {renderField(
                  "assignee",
                  "Assignee",
                  "select",
                  users.map((user) => ({ value: user.id, label: user.name }))
                )}
              </div>

              {/* Priority */}
              {/* <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Priority
                </div>
                {renderField("priority", "Priority", "select", [
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ])}
              </div> */}

              {/* Due Date */}
              <div className="space-y-1">
                <div className="text-sm font-medium text-muted-foreground">
                  Due Date
                </div>

                {renderField("closureDate", "Due Date", "date")}
              </div>

              {/* Created/Updated Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>
                  Created{" "}
                  {formatDistanceToNow(new Date(task.createdAt || Date.now()), {
                    addSuffix: true,
                  })}
                </div>
                <div>
                  Updated{" "}
                  {formatDistanceToNow(new Date(task.updatedAt || Date.now()), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
