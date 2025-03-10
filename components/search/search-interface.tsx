"use client"

import type React from "react"

import { useState } from "react"
import { useChat } from "ai/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Search } from "lucide-react"

export function SearchInterface() {
  const [query, setQuery] = useState("")
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/search",
  })

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI-Powered Search</CardTitle>
        <CardDescription>Search through your business function data using natural language</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <Input
            placeholder="Ask anything about your business function..."
            value={input}
            onChange={handleInputChange}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </form>
        <ScrollArea className="h-[400px] mt-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 p-4 rounded-lg ${message.role === "assistant" ? "bg-primary/10" : "bg-muted"}`}
            >
              <p className="text-sm">{message.content}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

