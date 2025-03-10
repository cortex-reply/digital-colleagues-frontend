"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Task } from "@/lib/types"

export function CalendarView({ tasks }: { tasks: Task[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Get tasks for the selected date
  const selectedDateTasks = date
    ? tasks.filter((task) => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        return taskDate.toDateString() === date.toDateString()
      })
    : []

  // Get dates with tasks for highlighting in the calendar
  const datesWithTasks = tasks.filter((task) => task.dueDate).map((task) => new Date(task.dueDate))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={{
                hasTasks: datesWithTasks,
              }}
              modifiersStyles={{
                hasTasks: {
                  fontWeight: "bold",
                  backgroundColor: "hsl(var(--primary) / 0.1)",
                  color: "hsl(var(--primary))",
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>
              {date
                ? date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "No date selected"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateTasks.length === 0 ? (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No tasks due on this date
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{task.title}</h3>
                      <Badge
                        variant={task.type === "epic" ? "default" : task.type === "story" ? "outline" : "secondary"}
                        className="rounded-md"
                      >
                        {task.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          task.status === "todo"
                            ? "outline"
                            : task.status === "in-progress"
                              ? "default"
                              : task.status === "review"
                                ? "secondary"
                                : "success"
                        }
                        className="rounded-md"
                      >
                        {task.status}
                      </Badge>
                      {task.assignee && (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-[10px] text-primary">
                            {task.assignee.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-xs">{task.assignee}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

