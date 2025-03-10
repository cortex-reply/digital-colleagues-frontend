"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Upload, Layers } from "lucide-react"
import { KanbanBoard } from "@/components/project/kanban-board"
import { CalendarView } from "@/components/project/calendar-view"
import { ChatInterface } from "@/components/chat/chat-interface"
import { EventFeed } from "@/components/project/event-feed"
import { CommentsFeed } from "@/components/project/comments-feed"
import { TaskModal } from "@/components/project/task-modal"
import type { Project, Task, Comment } from "@/lib/types"
import { users } from "@/lib/data" // Import users from your data file

export function ProjectView({ project: initialProject }: { project: Project }) {
  const [project, setProject] = useState(initialProject)
  const [open, setOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    type: "task",
    status: "todo",
    priority: "medium",
    assignee: "",
    dueDate: "",
  })
  const [file, setFile] = useState<File | null>(null)

  const handleCreateTask = () => {
    // In a real app, this would add to the database
    const createdTask: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      projectId: project.id,
    }
    setProject((prev) => ({
      ...prev,
      tasks: [...prev.tasks, createdTask],
      taskCount: prev.taskCount + 1,
    }))
    setOpen(false)
    setNewTask({
      title: "",
      description: "",
      type: "task",
      status: "todo",
      priority: "medium",
      assignee: "",
      dueDate: "",
    })
    setFile(null)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    }))
    setSelectedTask(null)
  }

  const handleAddComment = (newComment: Omit<Comment, "id" | "timestamp">) => {
    const comment: Comment = {
      ...newComment,
      id: `comment-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }
    setProject((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Job</DialogTitle>
              <DialogDescription>Add a new task, epic, or story to this project</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  className="col-span-3"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select value={newTask.type} onValueChange={(value) => setNewTask({ ...newTask, type: value })}>
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
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value })}>
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
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value })}>
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
                <Label htmlFor="assignee" className="text-right">
                  Assignee
                </Label>
                <Select value={newTask.assignee} onValueChange={(value) => setNewTask({ ...newTask, assignee: value })}>
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
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  className="col-span-3"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">
                  Description
                </Label>
                <Textarea
                  id="description"
                  className="col-span-3"
                  rows={3}
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
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
                        setFile(e.target.files[0])
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTask}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 h-11">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>Manage tasks, epics, and stories for this project</CardDescription>
            </CardHeader>
            <CardContent>
              <KanbanBoard tasks={project.tasks} onTaskClick={(task) => setSelectedTask(task)} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Project Calendar</CardTitle>
              <CardDescription>View tasks by their due dates</CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarView tasks={project.tasks} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Project Chat</CardTitle>
              <CardDescription>Communicate with your team members</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <ChatInterface
                messages={project.messages}
                contextType="project"
                contextId={project.id}
                currentUser={{
                  id: "current-user",
                  name: "You",
                  avatar: "/placeholder-user.jpg",
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Event Feed</CardTitle>
              <CardDescription>Recent updates to project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <EventFeed events={project.events} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comments">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Comments</CardTitle>
              <CardDescription>Recent comments on project tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <CommentsFeed comments={project.comments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={users}
          comments={project.comments.filter((comment) => comment.taskId === selectedTask.id)}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  )
}

