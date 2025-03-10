"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PlusCircle, Calendar, MessageSquare, ChevronRight, Briefcase } from "lucide-react"
import { getProjectsByBusinessFunctionId } from "@/lib/data"
import { ChatInterface } from "@/components/chat/chat-interface"
import { TeamMembersList } from "@/components/team/team-members-list"
import { SearchInterface } from "@/components/search/search-interface"
import type { BusinessFunction } from "@/lib/types"

export function BusinessFunctionView({ businessFunction }: { businessFunction: BusinessFunction }) {
  const [open, setOpen] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const projects = getProjectsByBusinessFunctionId(businessFunction.id)

  const handleCreateProject = () => {
    // In a real app, this would add to the database
    console.log("Creating project:", newProject)
    setOpen(false)
    setNewProject({ name: "", description: "" })
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Briefcase className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{businessFunction.name}</h1>
            <p className="text-muted-foreground">{businessFunction.description}</p>
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Create Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Add a new project to this business function</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="space-y-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/business-function/${businessFunction.id}/project/${project.id}`}
                className="block"
              >
                <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>{project.name}</CardTitle>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardDescription className="pt-1">{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.taskCount} tasks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.messageCount} messages</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 pt-3">
                    <div className="text-sm font-medium">Last updated: {project.lastUpdated}</div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>Business Function Chat</CardTitle>
              <CardDescription>Communicate with your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatInterface
                messages={businessFunction.messages}
                contextType="businessFunction"
                contextId={businessFunction.id}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Members of this business function</CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembersList members={businessFunction.members} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <SearchInterface />
        </TabsContent>
      </Tabs>
    </div>
  )
}

