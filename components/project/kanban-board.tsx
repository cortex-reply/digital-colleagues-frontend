"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import type { Task } from "@/lib/types"

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function KanbanBoard({ tasks, onTaskClick }: KanbanBoardProps) {
  const [taskList, setTaskList] = useState(tasks)
  const [filter, setFilter] = useState<string | null>(null)

  const columns = {
    backlog: {
      id: "backlog",
      title: "Backlog",
      taskIds: taskList.filter((t) => t.status === "backlog" && (!filter || t.epicId === filter)).map((t) => t.id),
    },
    todo: {
      id: "todo",
      title: "To Do",
      taskIds: taskList.filter((t) => t.status === "todo" && (!filter || t.epicId === filter)).map((t) => t.id),
    },
    inProgress: {
      id: "in-progress",
      title: "In Progress",
      taskIds: taskList.filter((t) => t.status === "in-progress" && (!filter || t.epicId === filter)).map((t) => t.id),
    },
    review: {
      id: "review",
      title: "Review",
      taskIds: taskList.filter((t) => t.status === "review" && (!filter || t.epicId === filter)).map((t) => t.id),
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: taskList.filter((t) => t.status === "done" && (!filter || t.epicId === filter)).map((t) => t.id),
    },
  }

  const epics = taskList.filter((task) => task.type === "epic")

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Update task status
    const updatedTasks = taskList.map((task) => {
      if (task.id === draggableId) {
        return { ...task, status: destination.droppableId }
      }
      return task
    })

    setTaskList(updatedTasks)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="epic-filter">Filter by Epic</Label>
          <Select value={filter || ""} onValueChange={(value) => setFilter(value || null)}>
            <SelectTrigger id="epic-filter" className="h-9">
              <SelectValue placeholder="All Epics" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Epics</SelectItem>
              {epics.map((epic) => (
                <SelectItem key={epic.id} value={epic.id}>
                  {epic.title}
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
                      const task = taskList.find((t) => t.id === taskId)
                      if (!task) return null

                      return (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
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
                                  <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-3">
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge
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
                                    </Badge>
                                    <Badge
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
                                    </Badge>
                                    {task.isBlocked ? (
                                      <Badge variant="destructive" className="rounded-md flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" />
                                        Blocked
                                      </Badge>
                                    ) : (
                                      <Badge variant="success" className="rounded-md flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Ready
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
                                  {task.isBlocked && task.blockedBy && task.blockedByTitle && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Blocked by:{" "}
                                      <Link href={`#${task.blockedBy}`} className="text-primary hover:underline">
                                        {task.blockedByTitle}
                                      </Link>
                                    </p>
                                  )}
                                  {task.dueDate && (
                                    <p className="text-xs mt-2 text-muted-foreground">
                                      Due: {new Date(task.dueDate).toLocaleDateString()}
                                    </p>
                                  )}
                                  {task.assignee && (
                                    <div className="mt-2 flex items-center gap-2">
                                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                                        {task.assignee.substring(0, 2).toUpperCase()}
                                      </div>
                                      <span className="text-xs">{task.assignee}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      )
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
  )
}

