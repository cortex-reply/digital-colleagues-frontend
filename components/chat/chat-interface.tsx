"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, PaperclipIcon as PaperClip } from "lucide-react"
import type { Message as AIMessage } from "ai"
import type { Message, User } from "@/lib/types"

interface ChatInterfaceProps {
  messages: Message[]
  contextType: "project" | "businessFunction"
  contextId: string
  currentUser?: User
}

export function ChatInterface({ messages: initialMessages, contextType, contextId, currentUser }: ChatInterfaceProps) {
  const { messages, input, handleInputChange, handleSubmit, setMessages } = useChat()
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Convert initial messages to AI SDK format
    const convertedMessages: AIMessage[] = initialMessages.map((msg) => ({
      id: msg.id,
      role: msg.sender.isAI ? "assistant" : "user",
      content: msg.content,
    }))
    setMessages(convertedMessages)
  }, [initialMessages, setMessages])

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [scrollAreaRef])

  const renderMessage = (message: AIMessage) => {
    const isCurrentUser = message.role === "user"
    const userName = isCurrentUser ? currentUser?.name || "You" : "AI Assistant"
    const userAvatar = isCurrentUser
      ? currentUser?.avatar || "/placeholder-user.jpg"
      : "/placeholder.svg?height=40&width=40"

    return (
      <div key={message.id} className={`flex items-start gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
        <Avatar className={!isCurrentUser ? "ai-border" : ""}>
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className={`grid gap-1.5 ${isCurrentUser ? "text-right" : ""}`}>
          <div className="flex items-center gap-2">
            <span className="font-medium">{userName}</span>
          </div>
          <div
            className={`rounded-lg p-3 text-sm ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            {message.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[600px] overflow-hidden">
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-6">{messages.map(renderMessage)}</div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="border-t p-4 bg-background">
        <div className="flex items-center gap-2 mb-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={handleInputChange}
            className="h-10 flex-grow"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // Here you would typically handle the file, e.g., upload it or prepare it for submission
                  console.log("File selected:", file.name)
                  // For this example, we'll just set the input to the file name
                  handleInputChange({
                    target: { value: `Uploading file: ${file.name}` },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              }}
            />
            <PaperClip className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </label>
          <Button type="submit" size="icon" className="shrink-0">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
        {input.startsWith("Uploading file:") && <div className="text-sm text-muted-foreground mt-1">{input}</div>}
      </form>
    </div>
  )
}

