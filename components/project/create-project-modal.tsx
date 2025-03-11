"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  businessFunctionId: string | null
}

export function CreateProjectModal({ isOpen, onClose, businessFunctionId }: CreateProjectModalProps) {
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    workInstructions: "",
  })
  const [file, setFile] = useState<File | null>(null)

  const handleCreateProject = () => {
    // In a real app, this would add to the database
    console.log("Creating project:", { ...newProject, businessFunctionId })
    onClose()
    setNewProject({
      name: "",
      description: "",
      workInstructions: "",
    })
    setFile(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
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
        <div className="flex justify-end">
          <Button onClick={handleCreateProject}>Create Project</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

