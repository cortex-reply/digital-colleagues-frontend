"use client";

import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Layers } from "lucide-react";
import { KanbanBoard } from "@/components/project/kanban-board";
import { CalendarView } from "@/components/project/calendar-view";
import { TaskModal } from "@/components/project/task-modal";
import { users } from "@/lib/data"; // Import users from your data file
import { getProjectTasks } from "@/actions/tasks";
import { Project, Task } from "@/payload-types";
import { useSocket } from "@/providers/socket";
import { useEpicContext } from "@/providers/epics";
import CreateTaskModal from "./create-task-modal";

export function ProjectView({ project: initialProject }: { project: Project }) {
  const [project, setProject] = useState<Project & { tasks?: Task[] }>(
    initialProject
  );
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { epics, refetch: refetchEpics } = useEpicContext();

  const { socket } = useSocket();

  useEffect(() => {
    socket?.on(`project/${project.id}/task`, (message) => {
      setProject((prev) => {
        let mappedTasks: Task[] = [];
        if (message.operation === "update") {
          mappedTasks =
            prev?.tasks?.map((el) => {
              if (el?.id !== message.doc?.id) return el;
              return message.doc;
            }) || [];

          return { ...prev, tasks: mappedTasks };
        } else if (message.operation === "delete") {
          mappedTasks =
            prev.tasks?.filter((el) => el.id !== message.doc?.id) || [];
        } else if (message) {
          mappedTasks = [...(prev.tasks || []), message.doc];
        }
        return { ...prev, tasks: mappedTasks };
      });
    });

    return () => {
      socket?.off(`project/${project.id}/task`);
    };
  }, [socket, project]);

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

  const handleTaskUpdate = (updatedTask: Task) => {
    setProject((prev) => ({
      ...prev,
      tasks: prev.tasks?.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      ),
    }));
    setSelectedTask(null);
  };

  // const handleAddComment = (newComment: Omit<Comment, "id" | "timestamp">) => {
  //   const comment: Comment = {
  //     ...newComment,
  //     id: `comment-${Date.now()}`,
  //     timestamp: new Date().toISOString(),
  //   };
  //   setProject((prev) => ({
  //     ...prev,
  //     comments: [...prev.comments, comment],
  //   }));
  // };

  const handleTaskCreation = useCallback(() => {
    setOpen(false);
    getTasks(project.id.toString());
  }, [project]);

  const handleEpicCreation = useCallback(() => {
    setOpen(false);
    refetchEpics();
  }, [project]);

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
        <CreateTaskModal
          isOpen={open}
          onOpenChange={setOpen}
          project={project}
          onEpicCreated={handleEpicCreation}
          onTaskCreated={handleTaskCreation}
        />
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
                tasks={project.tasks || []}
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
              <CalendarView tasks={project.tasks || []} />
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
            {/* <CardContent>
              <EventFeed events={project.events} />
            </CardContent> */}
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
            {/* <CardContent>
              <CommentsFeed comments={project.comments} />
            </CardContent> */}
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          users={users}
          // comments={project.comments.filter(
          //   (comment) => comment.taskId === selectedTask.id
          // )}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          // onAddComment={handleAddComment}
        />
      )}
    </div>
  );
}
