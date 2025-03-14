"use client";

import { useCallback, useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Epic, Task } from "@/payload-types";
import { getId } from "@/lib/utils";
import { updateTaskStatus } from "@/actions/tasks";

interface KanbanBoardProps {
  epics: Epic[];
  projectId: number;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export function KanbanBoard({
  epics,
  projectId,
  tasks,
  onTaskClick,
}: KanbanBoardProps) {
  const [taskList, setTaskList] =
    useState<(Task & { index?: number })[]>(tasks);
  // const [epics, setEpics] = useState<Epic[]>([]);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  const columns = {
    backlog: {
      id: "backlog",
      title: "Backlog",
      taskIds: taskList
        .filter(
          (t) =>
            t.status === "backlog" &&
            (!filter ||
              filter === "all" ||
              (t.epic && getId(t.epic) === filter))
        )
        .map((t) => t.id),
    },
    todo: {
      id: "todo",
      title: "To Do",
      taskIds: taskList
        .filter(
          (t) =>
            t.status === "todo" &&
            (!filter ||
              filter === "all" ||
              (t.epic && getId(t.epic) === filter))
        )
        .map((t) => t.id),
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      taskIds: taskList
        .filter(
          (t) =>
            t.status === "inProgress" &&
            (!filter ||
              filter === "all" ||
              (t.epic && getId(t.epic) === filter))
        )
        .map((t) => t.id),
    },
    // review: {
    //   id: "review",
    //   title: "Review",
    //   taskIds: taskList
    //     .filter(
    //       (t) => t.status === "review" && (!filter || t.epicId === filter)
    //     )
    //     .map((t) => t.id),
    // },
    done: {
      id: "done",
      title: "Done",
      taskIds: taskList
        .filter(
          (t) =>
            t.status === "done" &&
            (!filter ||
              filter === "all" ||
              (t.epic && getId(t.epic) === filter))
        )
        .map((t) => t.id),
    },
  };

  // const epics = taskList.filter((task) => task.type === "epic");

  const updateStatus = useCallback(
    async (status: Task["status"], taskId: number) => {
      const res = await updateTaskStatus(status, taskId);
      if (res.errors && res.errors?.length > 0) {
        // setTaskList((prev) => {
        //   const filtered = prev.filter((el) => el.id !== res.task.id);
        //   return [...filtered, res.task];
        // });
      }
    },
    []
  );

  const onDragEnd = useCallback(
    async (result: any) => {
      const { destination, source, draggableId } = result;

      if (!destination) return;

      if (destination.droppableId === source.droppableId) {
        return;
      }

      setTaskList((prev) => {
        const mapped = [...prev].map((el) => {
          if (el.id !== +draggableId) return el;
          return {
            ...el,
            status: destination.droppableId,
          };
        });

        return [...mapped];
      });

      await updateStatus(destination.droppableId, draggableId);
    },
    [taskList]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="epic-filter">Filter by Epic</Label>
          <Select
            value={filter || "all"}
            onValueChange={(value) => setFilter(value || null)}
          >
            <SelectTrigger id="epic-filter" className="h-9">
              <SelectValue placeholder="All Epics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Epics</SelectItem>
              {epics.map((epic) => (
                <SelectItem key={epic.id} value={epic.id.toString()}>
                  {epic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <Badge variant="outline" className="rounded-md">
                  {column.taskIds.length}
                </Badge>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-muted/50 rounded-lg p-2 min-h-[500px]"
                  >
                    {column.taskIds.map((taskId, index) => {
                      const task = taskList.find((t) => t.id === taskId);
                      if (!task) return null;

                      return (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-3"
                              onClick={() => onTaskClick(task)}
                            >
                              <Card className="cursor-pointer hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]">
                                <CardHeader className="p-3 pb-0">
                                  <CardTitle className="text-sm font-medium">
                                    {task.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3">
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {/* <Badge
                                      variant={
                                        task.type === "epic"
                                          ? "default"
                                          : task.type === "story"
                                            ? "outline"
                                            : "secondary"
                                      }
                                      className="rounded-md"
                                    >
                                      {task.type}
                                    </Badge> */}
                                    {/* <Badge
                                      variant={
                                        task.priority === "high"
                                          ? "destructive"
                                          : task.priority === "medium"
                                            ? "default"
                                            : "outline"
                                      }
                                      className="rounded-md"
                                    >
                                      {task.priority}
                                    </Badge> */}
                                    {/* {task.isBlocked ? (
                                      <Badge
                                        variant="destructive"
                                        className="rounded-md flex items-center gap-1"
                                      >
                                        <AlertCircle className="w-3 h-3" />
                                        Blocked
                                      </Badge>
                                    ) : (
                                      <Badge
                                        variant="success"
                                        className="rounded-md flex items-center gap-1"
                                      >
                                        <CheckCircle className="w-3 h-3" />
                                        Ready
                                      </Badge>
                                    )} */}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                    {task.description}
                                  </p>
                                  {/* {task.isBlocked &&
                                    task.blockedBy &&
                                    task.blockedByTitle && (
                                      <p className="text-xs text-muted-foreground mt-2">
                                        Blocked by:{" "}
                                        <Link
                                          href={`#${task.blockedBy}`}
                                          className="text-primary hover:underline"
                                        >
                                          {task.blockedByTitle}
                                        </Link>
                                      </p>
                                    )} */}
                                  {task.closureDate && (
                                    <p className="text-xs mt-2 text-muted-foreground">
                                      Due:{" "}
                                      {new Date(
                                        task.closureDate
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                  {task.assignee && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                                        {typeof task.assignee !== "number" &&
                                          typeof task.assignee.human !==
                                            "number" &&
                                          task.assignee.human?.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                      </div>
                                      <span className="text-xs">
                                        {typeof task.assignee !== "number" &&
                                          typeof task.assignee.human !==
                                            "number" &&
                                          task.assignee.human?.name}
                                      </span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
