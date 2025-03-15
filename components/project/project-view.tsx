"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { PlusCircle, Layers } from "lucide-react";
import { KanbanBoard } from "@/components/project/kanban-board";
import { CalendarView } from "@/components/project/calendar-view";
import { EventFeed } from "@/components/project/event-feed";
import { CommentsFeed } from "@/components/project/comments-feed";
import { TaskModal } from "@/components/project/task-modal";
import type { Project, Task, Comment } from "@/lib/types";
import { users } from "@/lib/data"; // Import users from your data file
import { createTask, getProjectTasks } from "@/actions/tasks";
import { createEpic, getProjectEpics } from "@/actions/epics";
import { Epic } from "@/payload-types";
import { useWebSocket } from "@/hooks/use-socket";
import { WSMessage } from "@/hooks/use-socket/types";
import { useSocket } from "@/providers/socket";

export function ProjectView({ project: initialProject }: { project: Project }) {
  const [project, setProject] = useState(initialProject);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [epics, setEpics] = useState<Epic[]>([]);
  const [type, setType] = useState<"epic" | "task">("task");

  const [taskState, taskFormAction] = useActionState(createTask, {} as any);
  const [epicState, epicFormAction] = useActionState(createEpic, {} as any);

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on(`tasks`, (message) => {
      if (message.operation === "update") {
        setProject((prev) => {
          if (!prev) return;
          const mappedTasks = prev?.tasks.map((el) => {
            if (el?.id !== message.doc?.id) return el;
            return message.doc;
          });

          return { ...prev, tasks: mappedTasks };
        });
      }
    });
  });

  const getTasks = useCallback(async (functionId: string) => {
    const res = await getProjectTasks(functionId);
    setProject((prev) => {
      if (!res.tasks) return { ...prev };
      return {
        ...prev,
        tasks: res.tasks,
      };
    });
  }, []);

  const getEpics = useCallback(async () => {
    const res = await getProjectEpics(project.id.toString());
    if (res.epics) setEpics(res.epics);
  }, [project.id]);

  useEffect(() => {
    getEpics();
  }, []);

  const handleTaskUpdate = (updatedTask: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
    setSelectedTask(null);
  };

  const handleAddComment = (newComment: Omit<Comment, "id" | "timestamp">) => {
    const comment: Comment = {
      ...newComment,
      id: `comment-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setProject((prev) => ({
      ...prev,
      comments: [...prev.comments, comment],
    }));
  };

  useEffect(() => {
    if (taskState && taskState.status === "success") {
      setOpen(false);
      getTasks(project.id.toString());
    }
  }, [taskState, project.id]);

  useEffect(() => {
    if (epicState && epicState.status === "success") {
      setOpen(false);
      setEpics((prev) => {
        return [...prev, epicState.epic];
      });
    }
  }, [epicState, project.id]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Layers className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {project.name}
            </h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form action={type === "task" ? taskFormAction : epicFormAction}>
              <DialogHeader>
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Add a new task to this project
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <input type="hidden" name="projectId" value={project.id} />
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input id="title" name="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="col-span-3"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    name="type"
                    value={type}
                    onValueChange={(value) => setType(value as "epic" | "task")}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="task">Task</SelectItem>
                      <SelectItem value="epic">Epic</SelectItem>
                      {/* <SelectItem value="story">Story</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
                {type === "task" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="epic" className="text-right">
                        Epic
                      </Label>
                      <Select name="epic">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Epic" />
                        </SelectTrigger>
                        <SelectContent>
                          {epics.map((el) => {
                            return (
                              <SelectItem value={el.id.toString()}>
                                {el.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">
                        Status
                      </Label>
                      <Select name="status">
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="backlog">Backlog</SelectItem>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="inProgress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="priority" className="text-right">
                        Priority
                      </Label>
                      <Select name="priority">
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
                      <Select name="assignee">
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
                        name="dueDate"
                        type="date"
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button type="submit">Create {type}</Button>
              </DialogFooter>
            </form>
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
              <CardDescription>
                Manage tasks, epics, and stories for this project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KanbanBoard
                epics={epics}
                projectId={project.id}
                tasks={project.tasks}
                onTaskClick={(task) => setSelectedTask(task)}
              />
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
              <CardDescription>
                Communicate with your team members
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {/* <ChatInterface
                messages={project.messages}
                contextType="project"
                contextId={project.id}
                currentUser={{
                  id: "current-user",
                  name: "You",
                  avatar: "/placeholder-user.jpg",
                }}
              /> */}
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
              <CardDescription>
                Recent comments on project tasks
              </CardDescription>
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
          comments={project.comments.filter(
            (comment) => comment.taskId === selectedTask.id
          )}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
