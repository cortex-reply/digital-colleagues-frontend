"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { RichTextEditor } from "@/components/ui/rich-text-editor"

// Mock data for squads
const squads = [
  { id: "1", name: "Squad A" },
  { id: "2", name: "Squad B" },
  { id: "3", name: "Squad C" },
]

interface CreateBusinessFunctionProps {
  onComplete: () => void
}

export function CreateBusinessFunction({ onComplete }: CreateBusinessFunctionProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    waysOfWorking: "",
    squad: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // const handleRichTextChange = (content: string) => {
  //   setFormData((prev) => ({ ...prev, waysOfWorking: content }))
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend API
    console.log("Submitting business function:", formData)
    // Call onComplete to close the modal
    onComplete()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Business Function</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="waysOfWorking">Ways of Working</Label>
            <Textarea
              id="waysOfWorking"
              name="waysOfWorking"
              value={formData.waysOfWorking}
              onChange={handleInputChange}
              placeholder="This will be replaced with a rich text editor later"
              rows={6}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="squad">Squad</Label>
            <Select value={formData.squad} onValueChange={(value) => handleSelectChange("squad", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a squad" />
              </SelectTrigger>
              <SelectContent>
                {squads.map((squad) => (
                  <SelectItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit}>
          Create Business Function
        </Button>
      </CardFooter>
    </Card>
  )
}

