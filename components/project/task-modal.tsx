"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import type { Task, User, Comment } from "@/lib/types"

interface TaskModalProps {
  task: Task
  users: User[]
  comments: Comment[]
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedTask: Task) => void
  onAddComment: (comment: Omit<Comment, "id" | "timestamp">) => void
}

export function TaskModal({ task, users, comments, isOpen, onClose, onUpdate, onAddComment }: TaskModalProps) {
  const [editedTask, setEditedTask] = useState(task)
  const [newComment, setNewComment] = useState("")

  const handleInputChange = (field: keyof Task, value: string) => {
    setEditedTask({ ...editedTask, [field]: value })
  }

  const handleUpdate = () => {
    onUpdate(editedTask)
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment({
        content: newComment,
        user: users[0], // Assuming the first user is the current user
        taskId: task.id,
        taskTitle: task.title,
      })
      setNewComment("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            <Input
              value={editedTask.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="text-xl font-bold"
            />
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="type" className="text-right">
              Type
            </label>
            <Select value={editedTask.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
                <SelectItem value="story">Story</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="status" className="text-right">
              Status
            </label>
            <Select value={editedTask.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="priority" className="text-right">
              Priority
            </label>
            <Select value={editedTask.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="assignee" className="text-right">
              Assignee
            </label>
            <Select value={editedTask.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
              <SelectTrigger className="col-span-3">
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
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="dueDate" className="text-right">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => handleInputChange("dueDate", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <label htmlFor="description" className="text-right pt-2">
              Description
            </label>
            <Textarea
              id="description"
              value={editedTask.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>
        </div>
        <Button onClick={handleUpdate}>Update Task</Button>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                  <AvatarFallback>{comment.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{comment.user.name}</p>
                  <p className="text-sm">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center space-x-2">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
            />
            <Button onClick={handleAddComment}>Add Comment</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

