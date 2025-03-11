"use client"

import { DialogFooter } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Calendar, MessageSquare, ChevronRight, Briefcase, Upload, Plus } from "lucide-react"
import { getProjectsByBusinessFunctionId } from "@/lib/data"
import { ChatInterface } from "@/components/chat/chat-interface"
import { SquadMembersList } from "@/components/squad/squad-members-list"
import { SearchInterface } from "@/components/search/search-interface"
import type { BusinessFunction, User } from "@/lib/types"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { users } from "@/lib/placeholder-data"

export function BusinessFunctionView({ businessFunction }: { businessFunction: BusinessFunction }) {
  const [open, setOpen] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    workInstructions: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const projects = getProjectsByBusinessFunctionId(businessFunction.id)

  const [availableColleagues, setAvailableColleagues] = useState<User[]>([])

  useEffect(() => {
    // In a real app, this would be an API call to get all colleagues not in the squad
    const allColleagues = users.filter((user) => !businessFunction.members.some((member) => member.id === user.id))
    setAvailableColleagues(allColleagues)
  }, [businessFunction.members])

  const handleAddColleague = (userId: string) => {
    const newMember = users.find((user) => user.id === userId)
    if (newMember) {
      const updatedMembers = [...businessFunction.members, newMember]
      // In a real app, this would be an API call to update the business function
      console.log("Adding colleague to squad:", newMember)
      console.log("Updated squad members:", updatedMembers)
      // Update the state or trigger a refetch of the business function data
    }
  }

  const handleRemoveColleague = (userId: string) => {
    const updatedMembers = businessFunction.members.filter((member) => member.id !== userId)
    // In a real app, this would be an API call to update the business function
    console.log("Removing colleague from squad:", userId)
    console.log("Updated squad members:", updatedMembers)
    // Update the state or trigger a refetch of the business function data
  }

  const handleCreateProject = () => {
    // In a real app, this would add to the database
    console.log("Creating project:", newProject)
    setOpen(false)
    setNewProject({
      name: "",
      description: "",
      workInstructions: "",
    })
    setFile(null)
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
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>Add a new project to this business function</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
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
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="workInstructions" className="text-right pt-2">
                  Work Instructions
                </Label>
                <Textarea
                  id="workInstructions"
                  className="col-span-3"
                  rows={4}
                  value={newProject.workInstructions}
                  onChange={(e) => setNewProject({ ...newProject, workInstructions: e.target.value })}
                  placeholder="Enter work instructions here"
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
              <Button onClick={handleCreateProject}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-11">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="squad">Squad</TabsTrigger>
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
        <TabsContent value="squad">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Squad Members</CardTitle>
                <CardDescription>Members of this business function squad</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Squad
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add Colleague to Squad</DialogTitle>
                    <DialogDescription>Select a colleague to add to this business function squad.</DialogDescription>
                  </DialogHeader>
                  <Select onValueChange={(value) => handleAddColleague(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a colleague" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableColleagues.map((colleague) => (
                        <SelectItem key={colleague.id} value={colleague.id}>
                          {colleague.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <SquadMembersList members={businessFunction.members} onRemoveMember={handleRemoveColleague} />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                To remove a squad member, click on their avatar and select "Remove from squad".
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="search">
          <SearchInterface />
        </TabsContent>
      </Tabs>
    </div>
  )
}

